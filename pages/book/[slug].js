import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const schools = {
  'bondi-surf': {
    name: 'Bondi Surf School',
    location: 'Bondi Beach, NSW 2026',
    description: 'Professional surf lessons for all skill levels on one of Australia\'s most iconic beaches.',
    instructor: 'Jake Morrison',
  },
  'manly-surf': {
    name: 'Manly Surf Academy',
    location: 'Manly Beach, NSW 2095',
    description: 'Learn to surf in the beautiful waters of Manly with our experienced instructors.',
    instructor: 'Sarah Chen',
  },
};

const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'];

export default function BookingPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', people: 1 });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const school = slug ? schools[slug] : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedSlot) newErrors.slot = 'Please select a time slot.';
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f2e9]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!school) {
    return (
      <>
        <Head><title>Booking Not Found | SurfDesk</title></Head>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f2e9] px-4">
          <div className="max-w-md rounded-lg border border-orange-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">SurfDesk</p>
            <h1 className="mt-3 text-3xl font-black text-gray-900">Booking page not found</h1>
            <p className="mt-3 text-gray-600">
              This surf school link is not active. Check your booking link or contact the school directly.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 font-bold text-white transition hover:bg-gray-700"
            >
              Back to SurfDesk
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Head><title>Booking Confirmed | {school.name}</title></Head>
        <main className="min-h-screen bg-[#f7f2e9] px-4 py-10">
          <section className="mx-auto max-w-2xl rounded-lg border border-green-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-600">Booking request sent</p>
            <h1 className="mt-3 text-3xl font-black text-gray-900">You&apos;re booked for {selectedSlot}</h1>
            <p className="mt-4 text-gray-600">
              Thanks, {formData.name}. {school.name} will confirm your lesson details by email shortly.
            </p>
            <div className="mt-6 rounded-md bg-green-50 p-4 text-sm text-green-900">
              <p><strong>School:</strong> {school.name}</p>
              <p><strong>Instructor:</strong> {school.instructor}</p>
              <p><strong>People:</strong> {formData.people}</p>
            </div>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 font-bold text-white transition hover:bg-gray-700"
            >
              Back to SurfDesk
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>Book a Lesson | {school.name}</title></Head>
      <main className="min-h-screen bg-[#f7f2e9] px-4 py-8 text-gray-900">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-lg border border-orange-200 bg-white p-6 shadow-sm">
            <Link href="/" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
              SurfDesk
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-orange-500">Student booking</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950">{school.name}</h1>
            <p className="mt-3 text-lg font-semibold text-gray-700">{school.location}</p>
            <p className="mt-5 max-w-2xl text-gray-600">{school.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-500">Instructor</p>
                <p className="mt-1 text-lg font-bold">{school.instructor}</p>
              </div>
              <div className="rounded-md border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-500">Lesson length</p>
                <p className="mt-1 text-lg font-bold">90 minutes</p>
              </div>
            </div>
          </section>

          <form className="rounded-lg border border-orange-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-black">Choose your lesson</h2>

            <fieldset className="mt-6">
              <legend className="text-sm font-bold uppercase tracking-wide text-gray-600">Available times</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setErrors(prev => ({ ...prev, slot: '' }));
                    }}
                    className={`rounded-md border px-4 py-3 text-sm font-bold transition ${
                      selectedSlot === slot
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.slot && <p className="mt-2 text-sm font-semibold text-red-600">{errors.slot}</p>}
            </fieldset>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Name
                <input
                  className="rounded-md border border-gray-300 px-3 py-3 font-normal text-gray-900 outline-none focus:border-orange-500"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="text-sm font-semibold text-red-600">{errors.name}</span>}
              </label>

              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Email
                <input
                  className="rounded-md border border-gray-300 px-3 py-3 font-normal text-gray-900 outline-none focus:border-orange-500"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="text-sm font-semibold text-red-600">{errors.email}</span>}
              </label>

              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Phone
                <input
                  className="rounded-md border border-gray-300 px-3 py-3 font-normal text-gray-900 outline-none focus:border-orange-500"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="text-sm font-semibold text-red-600">{errors.phone}</span>}
              </label>

              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Number of People
                <input
                  className="rounded-md border border-gray-300 px-3 py-3 font-normal text-gray-900 outline-none focus:border-orange-500"
                  type="number"
                  name="people"
                  min="1"
                  max="10"
                  value={formData.people}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-gray-900 px-5 py-3 font-black text-white transition hover:bg-gray-700"
            >
              Submit Booking Request
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
