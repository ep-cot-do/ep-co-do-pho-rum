import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <header className="w-full flex justify-center py-4">
        <Image
          className="dark:invert"
          src="/fcoder-logo.svg" // Replace with your logo
          alt="FCoder logo"
          width={180}
          height={60}
          priority
        />
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400">
          Welcome to FCoder
        </h1>

        <p className="text-xl text-gray-700 dark:text-gray-300">
          A community of passionate programmers dedicated to learning, coding,
          and building amazing projects together.
        </p>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            What We Do
          </h2>
          <ul className="list-disc list-inside text-left space-y-2 text-gray-600 dark:text-gray-300">
            <li>Weekly coding sessions and workshops</li>
            <li>Collaborative programming projects</li>
            <li>Technical discussions and knowledge sharing</li>
            <li>Hackathons and coding competitions</li>
            <li>Networking with industry professionals</li>
          </ul>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 sm:w-auto"
            href="/join"
          >
            Join FCoder
          </a>
          <a
            className="rounded-full border border-solid border-blue-600 dark:border-blue-400 transition-colors flex items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-800 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 w-full sm:w-auto text-blue-600 dark:text-blue-400"
            href="/events"
          >
            Upcoming Events
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-gray-600 dark:text-gray-400 py-6">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
        >
          About Us
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
        >
          Projects
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
        >
          Contact
        </a>
      </footer>
    </div>
  );
}
