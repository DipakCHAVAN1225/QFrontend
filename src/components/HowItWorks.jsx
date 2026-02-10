
import { Wrench, UserCheck, CreditCard } from "lucide-react";

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="py-16 pt-36 bg-gradient-to-b from-white via-indigo-50/40 to-white"
    >
      {/* Heading */}
      <div className="text-4xl text-center font-extrabold text-gray-900 mb-16">
        How It <span className="text-indigo-600">Works</span>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        
        {/* Card 1 */}
        <div className="group text-center p-8 border-1 border-blue-600 rounded-2xl bg-[#FFFFFF] shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg">
            1
          </div>
          <div className="flex justify-center mb-4 text-indigo-600 group-hover:scale-110 transition">
            <Wrench size={28} />
          </div>
          <div className="text-xl font-semibold">Choose a service</div>
          <p className="mt-2 text-sm text-gray-600">
            Tell us what you need — cleaning, repair, or installation.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group text-center p-8    border-1 border-blue-600 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg">
            2
          </div>
          <div className="flex justify-center mb-4 text-blue-600 group-hover:scale-110 transition">
            <UserCheck size={28} />
          </div>
          <div className="text-xl font-semibold">Pick a pro</div>
          <p className="mt-2 text-sm text-gray-600">
            Compare ratings, prices and choose the best professional.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group text-center    border-1 border-blue-600  p-8 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-lg">
            3
          </div>
          <div className="flex justify-center mb-4 text-emerald-600 group-hover:scale-110 transition">
            <CreditCard size={28} />
          </div>
          <div className="text-xl font-semibold">Schedule & pay</div>
          <p className="mt-2 text-sm text-gray-600">
            Book instantly and pay online with secure options.
          </p>
        </div>

      </div>
    </section>
  );
}
