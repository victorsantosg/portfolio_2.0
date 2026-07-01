import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log("=== NEW QUOTE RECEIVED ===")
    console.log(JSON.stringify(body, null, 2))
    
    const dataDir = path.join(process.cwd(), "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir)
    }
    
    const filePath = path.join(dataDir, "quotes.json")
    let quotes = []
    
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8")
      try {
        quotes = JSON.parse(fileData)
      } catch (e) {
        quotes = []
      }
    }
    
    const newQuote = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...body
    }
    
    quotes.push(newQuote)
    fs.writeFileSync(filePath, JSON.stringify(quotes, null, 2), "utf-8")
    
    return NextResponse.json({ success: true, message: "Quote submitted successfully", quoteId: newQuote.id })
  } catch (error: any) {
    console.error("Error saving quote:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
