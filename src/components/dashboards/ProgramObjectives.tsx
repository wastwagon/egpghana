'use client';

export default function ProgramObjectives() {
    const objectives = [
        {
            title: "Macroeconomic stability",
            subtitle: "To heal the sick economy",
            color: "red",
            borderColor: "border-t-red-500"
        },
        {
            title: "Debt sustainability",
            subtitle: "To enable Ghana pay her debt",
            color: "amber",
            borderColor: "border-t-amber-500"
        },
        {
            title: "Economic growth",
            subtitle: "To grow the economy & care for the poor",
            color: "emerald",
            borderColor: "border-t-emerald-500"
        }
    ];

    return (
        <section className="space-y-12">
            {/* Objectives Section */}
            <div>
                <div className="flex justify-center mb-10">
                    <span className="bg-[#2ecc71] text-white px-8 py-2 rounded-md text-lg font-bold shadow-sm uppercase tracking-wide">
                        Objectives
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {objectives.map((obj, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-2xl p-10 shadow-sm border border-slate-100 border-t-[6px] ${obj.borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center`}
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-4">{obj.title}</h3>
                            <p className="text-slate-600 font-medium">{obj.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* National Conversation Banner */}
            <div className="bg-[#f1f5f9] rounded-3xl p-12 md:p-20 text-center border border-slate-200 shadow-inner">
                <h3 className="text-3xl md:text-5xl font-bold text-slate-800 mb-8 leading-tight">
                    National <span className="text-[#2ecc71]">Conversation</span> on<br />
                    Economic Sustainability
                </h3>
                <p className="max-w-3xl mx-auto text-slate-600 leading-relaxed text-lg md:text-xl font-medium">
                    As a nation, we urgently need to have an honest national conversation and
                    decide on a collective action on building a more sustainable economy
                    beyond IMF bailouts!
                </p>
            </div>
        </section>
    );
}
