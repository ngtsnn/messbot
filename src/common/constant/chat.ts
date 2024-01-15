export const MSG_TEMPLATE = {
  FALLBACK:
    "🤖 Oops! I didn't quite catch that. Please try again or type /help for assistance. 👀",
  WELCOME: `
  *Welcome to Money Not Easy!*

  🌟 Hello there!

  Welcome to Money Not Easy - your personal finance companion. Ready to take control of your money? Let's get started!

  📊 *Track Expenses:* Easily monitor your spending and stay on budget.

  💸 *Budgeting Made Simple:* Set financial goals and watch your savings grow.

  📈 *Insights at a Glance:* Visualize your financial health with insightful charts.

  🚀 *Start Today:* Type /help to explore our features and take charge of your finances!

  👛 Happy budgeting!
  `,
  HELP: `
*Help - Money Not Easy*

Need assistance? Here are some commands to help you make the most of Money Not Easy:

1. */start*: Get a warm welcome and an introduction to Money Not Easy.

2. */help*: Display this help message to guide you through available commands.

3. */expenses [category] [amount]*: Log your expenses. Example: \`/expenses food 50\`.

4. */budget [category] [amount]*: Set a budget for a specific category. Example: \`/budget food 100\`.

5. */summary [month]*: View a summary of your expenses for the specified month. Example: \`/summary January\`.

6. */settings [option]*: Personalize your experience. Example: \`/settings currency USD\`.

7. */report [start_date] [end_date]*: Generate a financial report for a specific date range. Example: \`/report 2022-01-01 2022-12-31\`.

Feel free to explore these commands and manage your finances effectively with Money Not Easy! If you ever have questions, type /help to revisit this guide.
`,
  SYNTAX_ERROR: `
  *Invalid Command Syntax*

Oops! It seems like there's an issue with the command you entered. Please make sure you follow the correct syntax.

Here are some tips:
- Commands should start with a "/" (slash).
- Check for typos and ensure the command is spelled correctly.
- If the command requires parameters, make sure they are provided in the correct format.

For example:
- \`/start\` is a valid command.
- \`/search query\` is a valid command with a parameter.

If you're not sure about the correct syntax, type /help for assistance.

Feel free to try again or ask for help if needed. Thank you!

  `,

  INTERNAL_SERVER_ERROR: `
  *Internal Server Error*

Oops! Something went wrong on our end. Please try again later.

If the issue persists, feel free to contact support for assistance.

Thank you for your understanding! 🤖
  `,

  // budget
  BUDGET_SUCCESS: `

  **Budget Added Successfully!**

🎉 Your budget has been added successfully. Keep track of your expenses and stay on top of your financial goals!
  `,

  // expense
  EXPENSE_SUCCESS: `
  *Expense Record Added Successfully!*

🎉 Your expense record has been added successfully. Keep up the good work in managing your expenses!

Type \`/summary\` to view your records.
  `,
};
