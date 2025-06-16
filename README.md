This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Lost & Found Campus Website

Many students misplace items such as ID cards, books, or gadgets within the campus without a proper way to report or recover them. This Lost & Found web application addresses that problem by allowing users to easily report lost or found items via a public form. Admins manage these reports through a dedicated dashboard where they can approve, resolve, or delete items.

The platform streamlines the process of recovering lost belongings, increasing the chances of return while saving time for both students and staff.

## Tech Stack Used

- **Frontend:** Next.js, Tailwind CSS, ShadCN UI
- **Backend:** Next.js API Routes (TypeScript)
- **Database:** MongoDB

## Future Improvements

- ✅ OTP-based verification for college email addresses before reporting items (e.g., `@sru.edu.in`)
- ✅ More advanced and user-friendly Admin UI with filters, bulk actions, and insights
- ✅ Image uploads via cloud storage like Cloudinary
- ✅ Pagination and sorting for scalable data handling
- ✅ Auto-reminders for unclaimed items
- ✅ Reward system: The person who reports a found item gets rewarded if it is successfully resolved
