"use client";

import { motion } from "framer-motion";
import { Zap, Shield, FileText, Gauge } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: "Lightning fast",
      description: "Generate research content in under 60 seconds",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Shield,
      title: "Authentic sources",
      description: "Access to verified academic databases",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: FileText,
      title: "Humanized writing",
      description: "AI that writes like a human researcher",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Gauge,
      title: "File management",
      description: "Organize and manage research documents",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-normal text-gray-900">
            Built for researchers
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`${feature.bgColor} rounded-lg p-4 w-14 h-14 mx-auto mb-4 flex items-center justify-center border border-gray-100`}>
                <feature.icon size={20} className={feature.color} />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
