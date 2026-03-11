export const SUGGESTION_AI = {
    routine: `Convert the yearly goal into a daily routine.

    Rules:
    - Respond ONLY in valid JSON. No explanation, no markdown.
    - Output format: ["task1", "task2", "task3"]
    - Generate between 3 to 7 tasks. No more, no less.
    - Each task must be actionable, specific, and max 40 characters.
    - Tasks must be realistic for daily repetition.
    - No duplicates. No filler tasks.
    - Do not use '-', '*', or any special characters in task text.
    - If the goal is unrealistic, vague, or harmful, respond:
        { "error": [why you unable to generate suggestions (max 100 characters)] }

    Yearly goal:`
}

export const MAIL_VERIFICATION = (verifyUrl) => `
  <p>Hi there,</p>
  <p>You recently signed up for <strong>Todo Planner</strong>. Verify your email to activate your account:</p>
  <p style="text-align: center; margin: 24px 0;">
    <a href="${verifyUrl}"
       style="background-color: #2563eb; color: #ffffff; padding: 12px 24px;
              text-decoration: none; border-radius: 6px; font-weight: bold;
              display: inline-block;">
      Verify Email Address
    </a>
  </p>
    <p style="font-size: 13px; color: #6b7280;">
    This link expires in <strong>15 minutes</strong>. If you didn't create an account,
    you can safely ignore this email — no account has been created.
    </p>
  <p style="font-size: 12px; color: #9ca3af;">
    If the button doesn't work, copy and paste this URL into your browser:<br/>
    <span style="word-break: break-all;">${verifyUrl}</span>
  </p>
`;