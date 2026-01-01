"use client";

import { useMemo, useState } from "react";

type TimelineOption = "ready_now" | "1_3_months" | "3_6_months" | "exploring";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [corridor, setCorridor] = useState("");
    const [timeline, setTimeline] = useState<TimelineOption>("exploring");
    const [message, setMessage] = useState("");

    const timelineLabel = useMemo(() => {
        switch (timeline) {
            case "ready_now":
                return "Ready now";
            case "1_3_months":
                return "1–3 months";
            case "3_6_months":
                return "3–6 months";
            case "exploring":
            default:
                return "Just exploring";
        }
    }, [timeline]);

    const enquiryText = useMemo(() => {
        const lines = [
            "Hello Bhukya Krishna,",
            "",
            "I’m interested in open plots.",
            "",
            `Name: ${name || "-"}`,
            `Phone: ${phone || "-"}`,
            `Preferred corridor/area: ${corridor || "-"}`,
            `Timeline: ${timelineLabel}`,
            "",
            `Message: ${message || "-"}`,
        ];
        return lines.join("\n");
    }, [corridor, message, name, phone, timelineLabel]);

    const enquiryTextEncoded = useMemo(() => encodeURIComponent(enquiryText), [enquiryText]);

    const whatsappHref = useMemo(() => {
        return `https://wa.me/919848151456?text=${enquiryTextEncoded}`;
    }, [enquiryTextEncoded]);

    const mailHref = useMemo(() => {
        return `mailto:krishnaproperties9848@gmail.com?subject=${encodeURIComponent(
            "Plot enquiry"
        )}&body=${enquiryTextEncoded}`;
    }, [enquiryTextEncoded]);

    return (
        <div className="rounded-2xl border border-gold/20 bg-white/5 p-5 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-light">Send an enquiry</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Fill the details below, then send via WhatsApp or Email.
                    </p>
                </div>

                <a
                    href="tel:+919848151456"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-gold/30 bg-black/40 px-5 text-sm font-semibold text-white hover:border-gold hover:text-gold focus-ring"
                    aria-label="Call Bhukya Krishna at +91 9848 151 456"
                >
                    Call now
                </a>
            </div>

            <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="contact-name" className="text-sm font-medium text-gray-200">
                            Full name
                        </label>
                        <input
                            id="contact-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="contact-phone" className="text-sm font-medium text-gray-200">
                            Phone number
                        </label>
                        <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 …"
                            className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <label htmlFor="contact-corridor" className="text-sm font-medium text-gray-200">
                            Preferred corridor / area
                        </label>
                        <input
                            id="contact-corridor"
                            name="corridor"
                            type="text"
                            value={corridor}
                            onChange={(e) => setCorridor(e.target.value)}
                            placeholder="East Hyderabad / Hyderabad–Warangal / Other"
                            className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <label htmlFor="contact-timeline" className="text-sm font-medium text-gray-200">
                            Buying timeline
                        </label>
                        <select
                            id="contact-timeline"
                            name="timeline"
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value as TimelineOption)}
                            className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold"
                        >
                            <option value="ready_now">Ready now</option>
                            <option value="1_3_months">1–3 months</option>
                            <option value="3_6_months">3–6 months</option>
                            <option value="exploring">Just exploring</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <label htmlFor="contact-message" className="text-sm font-medium text-gray-200">
                            What are you looking for?
                        </label>
                        <textarea
                            id="contact-message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Budget, plot size, must-haves, and any locations you prefer"
                            className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-transform hover:scale-[1.01] focus-ring"
                        aria-label="Send enquiry on WhatsApp"
                    >
                        Send on WhatsApp
                    </a>
                    <a
                        href={mailHref}
                        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gold/30 bg-black/40 px-6 text-sm font-semibold text-white hover:border-gold hover:text-gold focus-ring"
                        aria-label="Send enquiry by email"
                    >
                        Send via Email
                    </a>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-gray-500">
                    This opens WhatsApp or Email on your device. No data is stored on the website.
                </p>
            </form>
        </div>
    );
}
