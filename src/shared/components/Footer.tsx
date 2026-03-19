import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { practiceLinks, resourceLinks, dashboardLinks } from "@/shared/data/footer-links"

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.footer
      className="w-full bg-white border-t border-gray-200 mt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Bottom accent bar — flipped to top of footer */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400" />

      <div className="px-8 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand column */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div
              className="text-2xl text-gray-900"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              Daily<span className="text-blue-500">SAT</span>
            </div>
            <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
              Empowering students to excel on the SAT with personalized practice, comprehensive materials, and proven strategies.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: "https://github.com/yourusername/dailysat", Icon: Github },
                { href: "https://twitter.com/dailysat", Icon: Twitter },
                { href: "https://linkedin.com/company/dailysat", Icon: Linkedin },
              ].map(({ href, Icon }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {[
            { label: "Practice", links: practiceLinks },
            { label: "Resources", links: resourceLinks },
            { label: "Dashboard", links: dashboardLinks },
          ].map(({ label, links }) => (
            <motion.div key={label} className="space-y-3" variants={itemVariants}>
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500">
                {label}
              </p>
              <ul className="space-y-2">
                {links.map(({ href, label: linkLabel }: { href: string; label: string }) => (
                  <motion.li key={href} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 hover:text-blue-500 font-light transition inline-block"
                    >
                      {linkLabel}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-400 font-light">
            © {new Date().getFullYear()} DailySAT. All rights reserved.
          </p>
          <Link
            href="/privacy-policy"
            className="text-xs text-gray-400 hover:text-blue-500 font-light transition"
          >
            Privacy Policy
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  );
}
