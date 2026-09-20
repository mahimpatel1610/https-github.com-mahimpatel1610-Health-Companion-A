import React, { useState } from 'react';
import {
  Pill,
  AlertTriangle,
  Search,
  ShieldAlert,
  Info,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { MedicationGuideItem } from '../../types';
import { MOCK_MEDICATION_GUIDE } from '../../data/mockHealthData';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface MedicationInfoPageProps {
  onAskAiAboutMed: (medName: string) => void;
}

export const MedicationInfoPage: React.FC<MedicationInfoPageProps> = ({
  onAskAiAboutMed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMed, setSelectedMed] = useState<MedicationGuideItem>(MOCK_MEDICATION_GUIDE[0]);

  const categories = ['All', 'Pain & Fever', 'NSAID / Anti-inflammatory', 'Antihistamine / Allergy', 'Electrolytes / Hydration', 'Acid Reducer / GI', 'Antibiotic (Prescription Only)'];

  const filtered = MOCK_MEDICATION_GUIDE.filter((med: MedicationGuideItem) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.generalUses.some((u: string) => u.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || med.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="medication-info-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Educational Medication Reference
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Medication Information
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Objective, plain-language reference on common over-the-counter and prescription medicines, side-effect profiles, and precautions.
        </p>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Mandatory Pharmaceutical Notice: </strong>
          Medication information presented here is strictly educational. Never start, alter, or discontinue any medication without consulting a qualified medical doctor or licensed pharmacist.
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search medications by name, category, or symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column: Medication List & Detailed Guide View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Med cards */}
        <div className="lg:col-span-4 space-y-2.5">
          {filtered.map((med: MedicationGuideItem) => {
            const isSelected = selectedMed.id === med.id;

            return (
              <div
                key={med.id}
                onClick={() => setSelectedMed(med)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-teal-500 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {med.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {med.category}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  Uses: {med.generalUses.join(', ')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: In-depth Educational Guide */}
        <div className="lg:col-span-8">
          {selectedMed && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedMed.name}
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {selectedMed.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Standard Route / Presentation: Oral tablets / suspension
                  </p>
                </div>

                <button
                  onClick={() => onAskAiAboutMed(selectedMed.name)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Ask AI About {selectedMed.name}</span>
                </button>
              </div>

              {/* General Uses */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Primary Educational Indications
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMed.generalUses.map((use: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      ✓ {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4-Item Clinical Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* General Precautions */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-teal-600" />
                    Key Precautions
                  </h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {selectedMed.generalPrecautions.map((p: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-600">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Side Effects */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Possible Side Effects
                  </h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {selectedMed.commonSideEffects.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* When to Seek a Doctor */}
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-2 text-xs">
                <h4 className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  When to Seek Immediate Medical Evaluation:
                </h4>
                <ul className="space-y-1 text-red-800 dark:text-red-200">
                  {selectedMed.whenToSeekDoctor.map((w: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span>⚠️</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety Checklist Box */}
              <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20 space-y-2 text-xs">
                <h4 className="font-bold text-teal-950 dark:text-teal-200">
                  Universal Patient Safety Checklist:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <p><strong>1. Age Specifics:</strong> Confirm weight & age appropriateness.</p>
                  <p><strong>2. Allergies:</strong> Check against active allergy records.</p>
                  <p><strong>3. Drug Interactions:</strong> Review active prescription list.</p>
                  <p><strong>4. Pregnancy/Nursing:</strong> Disclose status to medical provider.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
