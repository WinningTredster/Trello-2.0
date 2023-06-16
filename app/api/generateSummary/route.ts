import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {todos, username} = await request.json();

    //communicate with OpenAI
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n:1,
        stream: false,
        messages: [
            {
                role:"system",
                content: `When responding, welcome the user as ${username} and just add something encouraging (Don't be cheesy) app and Limit the response to 200 characters`
            },
            {
                role: "user",
                content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, then tell the user something encouraging! keep changing the prompt based on the data For example If all the tasks are done commend the user(Something like this) and if a category doesn't have anything just dont mention it and don't ask the user to communicate with you Here's the data ${JSON.stringify(todos)}`,
            }
        ]
    });
    const {data} = response;

    return NextResponse.json(data.choices[0].message);
}
