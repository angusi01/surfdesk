import { useMemo, useState } from 'react';
import { MarketingFooter } from '../../components/MarketingFooter';

const initialValues = {
  schoolName: '',
  location: '',
  lessonTypes: 'Beginner, Intermediate',
  groupSize: '',
  duration: '',
  price: '',
  email: '',
  phone: '',
  waiverRequired: true,
  cancellation: '',
};

export default function GeneratorPage() {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);

  const completion = useMemo(() => {
    const completedFields = [
      values.schoolName,
      values.location,
      values.groupSize,
      values.duration,
      values.price,
      values.email,
      values.phone,
      values.cancellation,
    ].filter(Boolean).length;
    return Math.max(33, Math.min(100, Math.round((completedFields / 8) * 100)));
  }, [values]);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      window.location.href = '/generator/result';
    }, 500);
  }

  return (
    <>
      <main className="generator-page">
        <section className="wizard-shell surface-section">
          <div className="wizard-progress">
            <div className="wizard-progress__labels">
              <span>Step 1 of 3: School Details</span>
              <span>{completion}% Complete</span>
            </div>
            <div className="wizard-progress__track" aria-hidden="true">
              <div className="wizard-progress__value" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <form className="wizard-card" onSubmit={handleSubmit}>
            <div className="wizard-section">
              <label>
                <span>School Name</span>
                <input
                  value={values.schoolName}
                  onChange={(event) => updateField('schoolName', event.target.value)}
                  placeholder="e.g. Noosa Learn to Surf"
                />
              </label>
              <label>
                <span>Beach / Location</span>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
                  <input
                    value={values.location}
                    onChange={(event) => updateField('location', event.target.value)}
                    placeholder="Search beach or city"
                  />
                </div>
              </label>
            </div>

            <div className="wizard-grid">
              <label>
                <span>Lesson Types</span>
                <select value={values.lessonTypes} onChange={(event) => updateField('lessonTypes', event.target.value)}>
                  <option>Beginner, Intermediate</option>
                  <option>Beginner Only</option>
                  <option>Intermediate &amp; Advanced</option>
                  <option>All Skill Levels</option>
                </select>
              </label>
              <label>
                <span>Max Group Size</span>
                <input
                  value={values.groupSize}
                  onChange={(event) => updateField('groupSize', event.target.value)}
                  placeholder="e.g. 8"
                  inputMode="numeric"
                />
              </label>
            </div>

            <div className="wizard-grid">
              <label>
                <span>Duration (Hours)</span>
                <input
                  value={values.duration}
                  onChange={(event) => updateField('duration', event.target.value)}
                  placeholder="e.g. 2 hours"
                />
              </label>
              <label>
                <span>Price per person</span>
                <div className="input-with-prefix">
                  <span>$</span>
                  <input
                    value={values.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    placeholder="75"
                    inputMode="numeric"
                  />
                </div>
              </label>
            </div>

            <div className="wizard-section wizard-section--split">
              <h2>Contact &amp; Policy</h2>
              <div className="wizard-grid">
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="contact@school.com"
                  />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    value={values.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    placeholder="+61 400 000 000"
                  />
                </label>
              </div>

              <div className="wizard-toggle">
                <div>
                  <strong>Waiver Requirement</strong>
                  <p>Require digital signature before booking</p>
                </div>
                <button
                  type="button"
                  className={values.waiverRequired ? 'toggle toggle--on' : 'toggle'}
                  aria-pressed={values.waiverRequired}
                  onClick={() => updateField('waiverRequired', !values.waiverRequired)}
                >
                  <span />
                </button>
              </div>

              <label>
                <span>Cancellation Policy</span>
                <textarea
                  value={values.cancellation}
                  onChange={(event) => updateField('cancellation', event.target.value)}
                  placeholder="Describe your refund rules..."
                  rows={3}
                />
              </label>
            </div>

            <div className="wizard-actions">
              <button type="submit" className="pill-button pill-button--large" disabled={submitting}>
                {submitting ? 'Saving...' : 'Next step'}
                <span className="material-symbols-outlined" aria-hidden="true">
                  {submitting ? 'progress_activity' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </form>

          <aside className="wizard-tip">
            <span className="material-symbols-outlined" aria-hidden="true">lightbulb</span>
            <p><strong>Pro tip:</strong> Schools with clear cancellation policies see 15% higher booking conversion rates. Don&apos;t worry, you can edit these details later.</p>
          </aside>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
