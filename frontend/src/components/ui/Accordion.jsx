import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

function AccordionItem({ id, question, answer, isOpen, onToggle }) {
  const panelId = `accordion-panel-${id}`
  const buttonId = `accordion-button-${id}`

  return (
    <div className="border-b border-border">
      <h3>
        <button
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 py-5 text-left font-body font-medium text-text hover:text-primary transition"
        >
          {question}
          <ChevronDown
            className={cn('w-4 h-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-muted pb-5 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Accordion({ items }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div>
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          id={i}
          question={item.question}
          answer={item.answer}
          isOpen={openId === i}
          onToggle={() => setOpenId(openId === i ? null : i)}
        />
      ))}
    </div>
  )
}

export default Accordion
