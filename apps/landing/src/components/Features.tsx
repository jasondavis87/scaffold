"use client";

import { motion } from "framer-motion";
import { Layers, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with performance in mind from the ground up.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Enterprise-grade security with zero configuration.",
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description: "Grows with your needs from MVP to millions of users.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">Features</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-lg border p-8"
            >
              <feature.icon className="text-primary h-10 w-10" />
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
