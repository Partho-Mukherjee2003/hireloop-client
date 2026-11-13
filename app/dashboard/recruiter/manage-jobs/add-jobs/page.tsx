// app/dashboard/recruiter/manage-jobs/add-jobs/page.tsx
"use client" // needed because we use a form submit handler

import { createJob } from "@/lib/actions/jobs";
import { ArrowRight, ChevronDown, Globe } from "lucide-react"
//Type
export type Category = (typeof categories)[number]
export type JobType = (typeof jobTypes)[number]
export type Frequency = (typeof frequencies)[number]
export type JobInput = {
  title: string
  companyName: string
  category: Category
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string // date text, for example "2025-05-30"
  minSalary: number
  maxSalary: number
  frequency: Frequency
  responsibilities: string
  requirements: string
}
// Options for the dropdowns and the job type buttons
const categories = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Customer Support",
  "Other",
]
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]
const frequencies = ["per hour", "per day", "per week", "per month", "per year"]

// Shared styles, so we do not repeat the same long class names again and again
const labelClass = "mb-1 block text-sm text-gray-300"
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-indigo-500"
const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"

const AddNewJobPage = () => {
  // Runs when the form is submitted
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // stop the page from reloading

    // 1. Get all the form data using FormData + Object.fromEntries
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData) as Record<string, string>

    // 2. Make the data ready to send.
    // A checkbox is only in FormData when it is checked, so we check it like this.
    const job = {
      title: data.title,
      companyName: data.companyName,
      category: data.category,
      jobType: data.jobType,
      isRemote: data.isRemote === "on", // true or false
      location: data.location,
      deadline: data.deadline,
      minSalary: Number(data.minSalary), // text -> number
      maxSalary: Number(data.maxSalary),
      frequency: data.frequency,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
    }

    // 3. The max salary must not be smaller than the min salary
    if (job.maxSalary < job.minSalary) {
      alert("Max salary cannot be smaller than min salary.")
      return
    }

    // 4. Everything is fine. Send `job` to your backend here.
    console.log("New job:", job)
    const result = await createJob(job)
    console.log(result);
  }

  return (
    <main className="p-4 text-white sm:p-6">
      {/* The whole page is one form, so the Publish button in the top also submits it */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-5">
        {/* ---------- Page header ---------- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs text-gray-400">
              Manage Jobs &gt;{" "}
              <span className="text-indigo-300">Create New Listing</span>
            </p>
            <h1 className="mt-2 text-3xl font-bold">Post a New Job</h1>
            <p className="mt-1 text-sm text-gray-400">
              Fill in the position specifications to attract qualified talent.
            </p>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-400"
          >
            Publish Job
            <ArrowRight size={16} />
          </button>
        </div>

        {/* ---------- 1. Basic Information ---------- */}
        <section className={cardClass}>
          <h2 className="mb-5 font-semibold">1. Basic Information</h2>

          <div className="space-y-4">
            {/* Job title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Job Title *
              </label>
              <input
                id="title"
                name="title" // the "name" attribute is the key in FormData
                type="text"
                required
                placeholder="Frontend Developer"
                className={inputClass}
              />
            </div>

            {/* Company name and category: 1 column on mobile, 2 on bigger screens */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className={labelClass}>
                  Company Name *
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  placeholder="HirePulse Network"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>
                  Job Category *
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue=""
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled className="bg-black">
                      Select a category
                    </option>
                    {categories.map((item) => (
                      <option key={item} value={item} className="bg-black">
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Job type: 4 buttons, only one can be selected (radio inputs) */}
            <div>
              <p className={labelClass}>Job Type *</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {jobTypes.map((type, index) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      defaultChecked={index === 0} // Full-time is selected at first
                      className="peer sr-only"
                    />
                    {/* peer-checked styles this box when the radio is selected */}
                    <div className="rounded-xl border border-white/10 bg-white/5 py-2.5 text-center text-sm text-gray-400 transition peer-checked:border-indigo-500 peer-checked:bg-indigo-500/20 peer-checked:text-white">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 2. Location, Compensation & Timeline ---------- */}
        <section className={cardClass}>
          <h2 className="mb-5 font-semibold">
            2. Location, Compensation &amp; Timeline
          </h2>

          <div className="space-y-4">
            {/* Remote switch (a checkbox that looks like a switch) */}
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-indigo-400" />
                <div>
                  <p className="text-sm font-medium">
                    Remote Work Allowed (isRemote)
                  </p>
                  <p className="text-xs text-gray-400">
                    Enable worldwide or distributed candidate applications
                  </p>
                </div>
              </div>

              <input type="checkbox" name="isRemote" className="peer sr-only" />
              {/* The switch. It turns indigo when the checkbox is checked */}
              <div className="relative h-6 w-11 shrink-0 rounded-full bg-white/20 transition peer-checked:bg-indigo-500 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
            </label>

            {/* Location and deadline */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className={labelClass}>
                  Job Location (location)
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder="New York, USA"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="deadline" className={labelClass}>
                  Application Deadline (deadline)
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  className={`${inputClass} scheme-dark`}
                />
              </div>
            </div>

            {/* Salary: 1 column on mobile, 3 on bigger screens */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="minSalary" className={labelClass}>
                  Min Salary / Rate
                </label>
                <input
                  id="minSalary"
                  name="minSalary"
                  type="number"
                  min="0"
                  required
                  placeholder="25"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="maxSalary" className={labelClass}>
                  Max Salary / Rate
                </label>
                <input
                  id="maxSalary"
                  name="maxSalary"
                  type="number"
                  min="0"
                  required
                  placeholder="40"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="frequency" className={labelClass}>
                  Frequency
                </label>
                <div className="relative">
                  <select
                    id="frequency"
                    name="frequency"
                    defaultValue="per hour"
                    className={`${inputClass} appearance-none`}
                  >
                    {frequencies.map((item) => (
                      <option key={item} value={item} className="bg-black">
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 3. Responsibilities & Requirements ---------- */}
        <section className={cardClass}>
          <h2 className="mb-5 font-semibold">
            3. Responsibilities &amp; Requirements
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="responsibilities" className={labelClass}>
                Key Responsibilities *
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                rows={4}
                required
                placeholder="Describe what this person will do..."
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="requirements" className={labelClass}>
                Qualifications &amp; Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                required
                placeholder="- 3+ years of experience with React..."
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Second Publish button at the bottom (easy to reach on mobile) */}
        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-medium transition hover:bg-indigo-400 sm:hidden"
        >
          Publish Job
        </button>
      </form>
    </main>
  )
}

export default AddNewJobPage
