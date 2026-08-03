import ShowFormsClient from "./ShowFormsClient";
import LoginGate from "./LoginGate";

/**
 * Internal dashboard for reading contact submissions. It was fully indexable
 * before — keep it out of search results entirely.
 */
export const metadata = {
  title: "Contact Submissions",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function Page() {
  return (
    <LoginGate>
      <ShowFormsClient />
    </LoginGate>
  );
}
