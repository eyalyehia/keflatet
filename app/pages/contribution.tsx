"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

// Types
type DonationOption = "monthly" | "basket" | "oneTime";

interface FormState {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function ContributionPage(): React.ReactElement {
  const [selected, setSelected] = useState<DonationOption>("monthly");
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "" });
  const [isSmall, setIsSmall] = useState<boolean>(false);

  // Detect viewport for sticky CTA visibility
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsSmall(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize as EventListener);
  }, []);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Open donation link in new tab
    window.open(
      "https://www.matara.pro/nedarimplus/online/?mosad=7014073",
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Simple emoji-based animation using framer-motion (no extra deps)
  const controls = useAnimation();
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      while (mounted) {
        // Closed fridge
        await controls.start({ rotate: 0, scale: 1, transition: { duration: 0.6 } });
        // Pray
        await controls.start({ rotate: -5, scale: 1.05, transition: { duration: 0.6 } });
        // Full fridge celebration
        await controls.start({ rotate: 5, scale: 1.08, transition: { duration: 0.6 } });
        await controls.start({ rotate: 0, scale: 1, transition: { duration: 0.6 } });
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [controls]);

  const optionClasses = useMemo(
    () =>
      ({
        monthly:
          "bg-primary text-[#2a2b26] hover:brightness-110",
        basket:
          "bg-secondary text-[#2a2b26] hover:brightness-110",
        oneTime:
          "bg-accent text-[#2a2b26] hover:bg-accent-dark",
      } as const),
    []
  );

  const OptionButton = ({
    id,
    label,
    emoji,
  }: {
    id: DonationOption;
    label: string;
    emoji: string;
  }): React.ReactElement => (
    <motion.button
      type="button"
      onClick={() => setSelected(id)}
      className={`py-4 px-6 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg flex items-center gap-3 cursor-pointer ${optionClasses[id]} ${
        selected === id ? "ring-2 ring-white/70" : ""
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected === id}
    >
      <span className="text-xl" aria-hidden>
        {emoji}
      </span>
      <span className="font-semibold font-staff">{label}</span>
    </motion.button>
  );

  return (
    <main className="px-4 py-10 w-full min-h-screen bg-cream md:px-6 lg:px-10 md:py-14">
      {/* Header */}
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-extrabold font-staff text-center md:text-5xl text-primary">
          הצטרפו אלינו – כל תרומה משנה חיים
        </h1>
        <p className="mt-3 text-sm text-center md:text-base text-gray">
          לא חובה למלא את כל הפרטים – רק שם ושם משפחה.
        </p>
      </section>

      {/* Options */}
      <section className="mx-auto mt-8 max-w-5xl md:mt-10">
        <div className="flex flex-col gap-4 justify-center md:flex-row">
          <OptionButton id="monthly" label="תרומה חודשית" emoji="♻️" />
          <OptionButton id="basket" label="סל לתרומה" emoji="🛒" />
          <OptionButton id="oneTime" label="תרומה חד פעמית" emoji="💝" />
        </div>
      </section>

      {/* Form + Animation */}
      <section className="grid grid-cols-1 gap-8 items-start mx-auto mt-10 max-w-6xl lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 rounded-2xl border shadow-sm backdrop-blur bg-accent/10 border-accent">
          {/* Names */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium font-staff text-[#2a2b26] mb-1">
                שם <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={onInputChange}
                placeholder="שם פרטי"
                className="w-full rounded-lg border border-accent bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-[#2a2b26] placeholder:text-gray"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium font-staff text-[#2a2b26] mb-1">
                שם משפחה <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={onInputChange}
                placeholder="שם משפחה"
                className="w-full rounded-lg border border-accent bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-[#2a2b26] placeholder:text-gray"
              />
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium font-staff text-[#2a2b26] mb-1">
                טלפון <span className="text-[#2a2b26] text-xs">(לא חובה – ניתן להשאיר ריק)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone ?? ""}
                onChange={onInputChange}
                placeholder="050-0000000"
                className="w-full rounded-lg border border-accent bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-[#2a2b26] placeholder:text-gray"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium font-staff text-[#2a2b26] mb-1">
                אימייל <span className="text-[#2a2b26] text-xs">(לא חובה – ניתן להשאיר ריק)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email ?? ""}
                onChange={onInputChange}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-accent bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-[#2a2b26] placeholder:text-gray"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="address" className="block text-sm font-medium font-staff text-[#2a2b26] mb-1">
              כתובת <span className="text-[#2a2b26] text-xs">(לא חובה – ניתן להשאיר ריק)</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address ?? ""}
              onChange={onInputChange}
              placeholder="רחוב, מספר, עיר"
              className="w-full rounded-lg border border-accent bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-[#2a2b26] placeholder:text-gray"
            />
          </div>

          {/* Primary CTA */}
          <div className="flex gap-3 items-center mt-6">
            <a
              href="https://www.matara.pro/nedarimplus/online/?mosad=7014073"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 items-center px-6 py-3 font-bold font-staff text-white rounded-lg bg-accent hover:bg-accent-dark cursor-pointer"
            >
              <span className="text-lg" aria-hidden>
                ❤️
              </span>
              <span>לתמיכה עכשיו</span>
            </a>

            {/* Secondary helper text */}
            <span className="text-xs text-[#2a2b26]">פתיחה בחלון חדש</span>
          </div>
        </form>

        {/* Illustration / Animation */}
        <div className="flex justify-center items-center">
          <div className="p-6 w-full max-w-md rounded-2xl border shadow-sm bg-accent/10 border-accent">
            <div className="text-center text-sm text-[#2a2b26] mb-3">אנימציה: ילד פותח מקרר ריק, מתפלל והמקרר מתמלא</div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-accent/30 grid place-items-center bg-cream">
              {/* Emoji-based simple animation */}
              <motion.div
                initial={{ scale: 1 }}
                animate={controls}
                className="text-6xl select-none text-[#2a2b26]"
                aria-label="Fridge and food animation"
              >
                🧊➕🙏➕🧺
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Reinforcement */}
      <section className="mx-auto mt-8 max-w-4xl">
        <p className="mt-4 text-lg text-center text-primary-dark">
          בזכותך, עוד משפחה תשב לשולחן מלא – תודה על הלב הגדול 💛
        </p>
      </section>

      {/* Image at bottom */}
      <section className="mx-auto mt-6 max-w-5xl">
        <div className="overflow-hidden rounded-2xl shadow-md">
          {/* Replace with a real image under public/images/food-basket.jpg */}
          <Image
            src="/images/food-basket.jpg"
            alt="סל מזון של העמותה"
            width={1600}
            height={900}
            className="object-cover w-full h-auto"
            sizes="100vw"
            priority={false}
          />
        </div>
      </section>

      {/* Sticky CTA for small screens */}
      {isSmall && (
        <Link
          href="https://www.matara.pro/nedarimplus/online/?mosad=7014073"
          target="_blank"
          className="flex fixed right-4 bottom-4 z-50 gap-2 items-center px-5 py-3 font-bold font-staff text-white rounded-full shadow-lg bg-accent hover:bg-accent-dark md:hidden cursor-pointer"
        >
          <span className="text-lg" aria-hidden>
            ❤️
          </span>
          <span>לתמיכה עכשיו</span>
        </Link>
      )}
    </main>
  );
}
