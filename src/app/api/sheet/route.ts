import { google } from "googleapis";
import { NextResponse } from "next/server";
import { SheetAPIResponse } from "@/types";

let cachedData: SheetAPIResponse | null = null;
let lastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export async function GET(req: Request) {
  const url = new URL(req.url);
  const refresh = url.searchParams.get("refresh");

  const now = Date.now();
  if (!refresh && cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SHEET_ID || "";
  const configRange = `${process.env.SHEET_NAME || "CONFIG"}!B4:C14`;
  const configRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: configRange,
  });
  const configRows = configRes.data.values ?? [];
  const config: Record<string, string> = {};
  for (const [key, value] of configRows) {
    config[key] = value;
  }

  const numBtns = parseInt(config["NumberOfBtn"] ?? "0");
  const numEvents = parseInt(config["NumberOfEvents"] ?? "0");

  const btnEndRow = 4 + numBtns;
  const eventEndRow = 4 + numEvents;

  const [buttonsRes, eventsRes] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${process.env.SHEET_NAME || "CONFIG"}!E5:F${btnEndRow}`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${process.env.SHEET_NAME || "CONFIG"}!H5:L${eventEndRow}`,
    }),
  ]);

  const buttonsRows = buttonsRes.data.values ?? [];
  const buttons = buttonsRows.map(([name, link]) => ({ name, link }));

  const eventRows = eventsRes.data.values ?? [];
  const events = eventRows.map(([name, venue, date, link, image]) => ({
    name,
    venue,
    date,
    link,
    image,
  }));

  const response = { config, buttons, events };
  cachedData = response as SheetAPIResponse;
  lastFetch = now;
  console.log(response);
  return NextResponse.json(response);
}
