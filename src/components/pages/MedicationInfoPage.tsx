import React, { useState, useEffect } from 'react';
import {
  Pill,
  AlertTriangle,
  Search,
  ShieldAlert,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
  Activity,
  Layers,
  HeartPulse,
  AlertOctagon,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { MedicationGuideItem } from '../../types';
import { MOCK_MEDICATION_GUIDE } from '../../data/mockHealthData';

interface MedicationInfoPageProps {
  onAskAiAboutMed: (medName: string) => void;
}

const CATEGORY_TABS = [
  { label: 'All Medications', key: 'All' },
  { label: 'Pain & Fever', key: 'pain-fever' },
  { label: 'NSAID / Anti-inflammatory', key: 'nsaid' },
  { label: 'Antihistamine & Allergy', key: 'antihistamine' },
  { label: 'Electrolytes & Hydration', key: 'electrolytes' },
  { label: 'Acid Reducer & GI', key: 'gi-acid' },
  { label: 'Antibiotics', key: 'antibiotic' },
  { label: 'Neurology & Spine', key: 'neurology' },
  { label: 'Dental & Oral Care', key: 'dental' }
];

export const MedicationInfoPage: React.FC<MedicationInfoPageProps> = ({
  onAskAiAboutMed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('All');
  const [selectedMedId, setSelectedMedId] = useState<string>(MOCK_MEDICATION_GUIDE[0]?.id || 'med-paracetamol');
  const [activeDetailSection, setActiveDetailSection] = useState<'overview' | 'dosing' | 'interactions' | 'sideEffects' | 'safety'>('overview');

  const filtered = MOCK_MEDICATION_GUIDE.filter((med: MedicationGuideItem) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      med.name.toLowerCase().includes(query) ||
      (med.genericName && med.genericName.toLowerCase().includes(query)) ||
      med.category.toLowerCase().includes(query) ||
      med.generalUses.some((u: string) => u.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategoryKey === 'All' ||
      med.categoryKey === selectedCategoryKey ||
      med.category.toLowerCase().includes(selectedCategoryKey.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Whenever the category filter or search query filters out current selection, switch to the first matching item
  useEffect(() => {
    if (filtered.length > 0) {
      const exists = filtered.some((m) => m.id === selectedMedId);
      if (!exists) {
        setSelectedMedId(filtered[0].id);
      }
    }
  }, [selectedCategoryKey, searchQuery, filtered, selectedMedId]);

  const selectedMed =
    filtered.find((m) => m.id === selectedMedId) ||
    MOCK_MEDICATION_GUIDE.find((m) => m.id === selectedMedId) ||
    filtered[0] ||
    MOCK_MEDICATION_GUIDE[0];

  return (
    <div id="medication-info-section" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Clinical Drug Index & Monograph
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {MOCK_MEDICATION_GUIDE.length} Monitored Formulations
            </span>
          </div>
          <button
            onClick={() => onAskAiAboutMed(selectedMed?.name || 'Medication Safety')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>Consult AI on {selectedMed?.name || 'Medications'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Medication Information Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Comprehensive, evidence-based monographs across analgesic, antibiotic, gastrointestinal, neurological, antihistamine, electrolyte, and dental therapies. Review indications, pharmacology, strict dosing rules, and contraindications.
        </p>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Mandatory Pharmacovigilance Disclaimer: </strong>
          Information provided within this directory is compiled for educational reference and clinical literacy only. Never commence, alter, or discontinue any prescription or over-the-counter therapeutic regimen without explicit guidance from a qualified medical doctor or licensed pharmacist.
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by medication name, generic ingredient, or medical indication..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isTabActive = selectedCategoryKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setSelectedCategoryKey(tab.key);
                }}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isTabActive
                    ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Directory List + Detailed Dynamic Monograph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Formulations List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[850px] overflow-y-auto pr-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
              <Pill className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No medications match your filter
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for a different drug name or reset category to "All Medications".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryKey('All');
                }}
                className="mt-3 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-600 text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filtered.map((med: MedicationGuideItem) => {
              const isSelected = selectedMed?.id === med.id;
              const isRx = med.otcStatus?.toLowerCase().includes('prescription');

              return (
                <div
                  key={med.id}
                  id={`med-card-${med.id}`}
                  onClick={() => setSelectedMedId(med.id)}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-teal-500 dark:border-teal-400 bg-teal-50/70 dark:bg-teal-950/50 shadow-xs ring-1 ring-teal-400/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400'}`}>
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {med.name}
                        </h3>
                        {med.genericName && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {med.genericName}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        isRx
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {isRx ? 'Rx Only' : 'OTC'}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <span className="truncate max-w-[200px] font-medium text-slate-600 dark:text-slate-300">
                      {med.category}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
                      {isSelected ? 'Viewing' : 'Details →'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: In-depth Monograph View */}
        <div className="lg:col-span-8">
          {selectedMed ? (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
              {/* Header Details */}
              <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {selectedMed.name}
                      </h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {selectedMed.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          selectedMed.otcStatus?.toLowerCase().includes('prescription')
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {selectedMed.otcStatus}
                      </span>
                    </div>

                    {selectedMed.genericName && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
                        Active Formulation: <span className="text-slate-900 dark:text-white font-bold">{selectedMed.genericName}</span>
                      </p>
                    )}

                    {selectedMed.dosageForm && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dosage & Presentation: {selectedMed.dosageForm}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onAskAiAboutMed(selectedMed.name)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900 flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ask AI Assistant</span>
                  </button>
                </div>

                {/* Section Quick Switcher Tabs */}
                <div className="flex items-center gap-1 mt-5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800/80 custom-scrollbar">
                  {[
                    { id: 'overview', label: 'Indications & MoA' },
                    { id: 'dosing', label: 'Dosing & Administration' },
                    { id: 'interactions', label: 'Drug & Food Interactions' },
                    { id: 'sideEffects', label: 'Side Effects & Warnings' },
                    { id: 'safety', label: 'Safety & Populations' }
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setActiveDetailSection(sec.id as any)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                        activeDetailSection === sec.id
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 1: Overview, Indications & Clinical Pharmacology */}
              {(activeDetailSection === 'overview' || activeDetailSection === 'safety') && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      Approved Indications & Clinical Uses
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMed.generalUses.map((use: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedMed.clinicalProfile && (
                    <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/50 dark:bg-teal-950/20 space-y-2 text-xs">
                      <h4 className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-teal-600" />
                        Clinical Pharmacology & Mechanism
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-900 dark:text-white">Class:</strong> {selectedMed.clinicalProfile.therapeuticClass}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-900 dark:text-white">Mechanism:</strong> {selectedMed.clinicalProfile.mechanismOfAction}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium">
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-teal-200 dark:border-teal-800">
                          <span className="text-slate-500">Onset of Action:</span> {selectedMed.clinicalProfile.onsetOfAction}
                        </div>
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-teal-200 dark:border-teal-800">
                          <span className="text-slate-500">Duration:</span> {selectedMed.clinicalProfile.durationOfAction}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 2: Dosing & Administration Rules */}
              {(activeDetailSection === 'dosing' || activeDetailSection === 'overview') && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Administration Protocol & Dosing Ceilings
                  </h3>

                  {selectedMed.administration ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <p className="font-bold text-slate-900 dark:text-white">Standard Dosage</p>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedMed.administration.typicalDosage}</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <p className="font-bold text-slate-900 dark:text-white">Administration Timing</p>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedMed.administration.administrationTiming}</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
                        <p className="font-bold text-amber-900 dark:text-amber-300">Maximum 24-Hour Ceiling</p>
                        <p className="text-amber-800 dark:text-amber-200 mt-1 font-medium">{selectedMed.administration.maximumDailyLimit}</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <p className="font-bold text-slate-900 dark:text-white">Missed Dose Rule</p>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedMed.administration.missedDoseAdvice}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                      Standard weight and age-appropriate dosing must be determined by a certified physician or pharmacist.
                    </div>
                  )}

                  {/* General Precautions List */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-teal-600" />
                      Essential Prescribing & Consumption Precautions
                    </h4>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      {selectedMed.generalPrecautions.map((p: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Section 3: Drug, Food & Disease Interactions */}
              {(activeDetailSection === 'interactions' || activeDetailSection === 'dosing') && selectedMed.interactionsDetail && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Pharmacological Interactions & Contraindications
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-1.5">
                      <h4 className="font-bold text-amber-900 dark:text-amber-300">Major Drug-Drug Interactions</h4>
                      <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                        {selectedMed.interactionsDetail.majorDrugInteractions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold">⚠️</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
                      <h4 className="font-bold text-slate-900 dark:text-white">Food & Dietary Interactions</h4>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        {selectedMed.interactionsDetail.foodAndDietaryInteractions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-teal-600">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 space-y-1.5 text-xs">
                    <h4 className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-red-600" />
                      Contraindicated Health Conditions
                    </h4>
                    <ul className="space-y-1 text-red-800 dark:text-red-200">
                      {selectedMed.interactionsDetail.contraindicatedConditions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-bold text-red-600">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Section 4: Side Effects Triaging & Emergency Alerts */}
              {(activeDetailSection === 'sideEffects' || activeDetailSection === 'interactions') && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <BadgeAlert className="w-4 h-4 text-amber-500" />
                    Adverse Reactions & Side-Effect Triaging
                  </h3>

                  {selectedMed.sideEffectsBreakdown ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-white">Mild & Tolerated</h4>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                          {selectedMed.sideEffectsBreakdown.mildFrequent.map((e, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-teal-600">•</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-1.5">
                        <h4 className="font-bold text-amber-900 dark:text-amber-300">Requires Monitoring</h4>
                        <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                          {selectedMed.sideEffectsBreakdown.moderateRequiresMonitoring.map((e, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span>⚠️</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 space-y-1.5">
                        <h4 className="font-bold text-red-900 dark:text-red-300">Emergency Stop Symptoms</h4>
                        <ul className="space-y-1 text-red-800 dark:text-red-200">
                          {selectedMed.sideEffectsBreakdown.severeEmergencySymptoms.map((e, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="font-bold text-red-600">🚨</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {selectedMed.commonSideEffects.map((s: string, idx: number) => (
                        <p key={idx}>• {s}</p>
                      ))}
                    </div>
                  )}

                  {/* When to Seek Doctor */}
                  <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-2 text-xs">
                    <h4 className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      When to Seek Immediate Medical Evaluation:
                    </h4>
                    <ul className="space-y-1 text-red-800 dark:text-red-200">
                      {selectedMed.whenToSeekDoctor.map((w: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span>🚨</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Section 5: Special Populations & Patient Safety Checklist */}
              {(activeDetailSection === 'safety' || activeDetailSection === 'sideEffects') && (
                <div className="space-y-4">
                  {selectedMed.specialPopulations && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-teal-600" />
                        Special Populations Guidance
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                          <p className="font-bold text-slate-900 dark:text-white">Pregnancy & Lactation</p>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedMed.specialPopulations.pregnancyLactation}</p>
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                          <p className="font-bold text-slate-900 dark:text-white">Renal Considerations</p>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedMed.specialPopulations.renalImpairment}</p>
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                          <p className="font-bold text-slate-900 dark:text-white">Hepatic Considerations</p>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedMed.specialPopulations.hepaticConsideration}</p>
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                          <p className="font-bold text-slate-900 dark:text-white">Pediatric & Geriatric Notes</p>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedMed.specialPopulations.pediatricGeriatricNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Safety Checklist Box - SPECIFIC TO THIS MEDICATION */}
                  <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20 space-y-2 text-xs">
                    <h4 className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      Individual Patient Safety Checklist for {selectedMed.name}:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-100 dark:border-teal-900">
                        <strong className="text-slate-900 dark:text-white">Age Considerations: </strong>
                        {selectedMed.safetyChecklist.ageConsideration}
                      </div>
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-100 dark:border-teal-900">
                        <strong className="text-slate-900 dark:text-white">Allergy Screening: </strong>
                        {selectedMed.safetyChecklist.allergyWarning}
                      </div>
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-100 dark:border-teal-900">
                        <strong className="text-slate-900 dark:text-white">Drug Interactions: </strong>
                        {selectedMed.safetyChecklist.interactionsWarning}
                      </div>
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-100 dark:border-teal-900">
                        <strong className="text-slate-900 dark:text-white">Pregnancy Caution: </strong>
                        {selectedMed.safetyChecklist.pregnancyWarning}
                      </div>
                    </div>
                  </div>

                  {/* Storage & Safe Disposal */}
                  {selectedMed.storageAndDisposal && (
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">Storage & Safe Disposal</p>
                      <p>• <strong>Environment:</strong> {selectedMed.storageAndDisposal.temperature} ({selectedMed.storageAndDisposal.moistureGuidance})</p>
                      <p>• <strong>Safety:</strong> {selectedMed.storageAndDisposal.childSafety}</p>
                      <p>• <strong>Ecological Disposal:</strong> {selectedMed.storageAndDisposal.disposalProcedure}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
              <Pill className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Select a medication from the directory
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Choose any item on the left to read its full clinical monograph and pharmacology.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
