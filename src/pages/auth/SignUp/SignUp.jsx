import { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    schoolNumber: '',
    completedSemesters: '',
    major: '',
    curriculum: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const majors = [
    "Computer Science",
    "Computer Engineering",
    "Software Engineering",
    "Information Systems",
  ];

  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, curriculum: file });
      setError('');
    } else {
      setError('Please upload a PDF file');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Signing up with:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            {/* All form fields remain the same */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="relative block w-full rounded-lg border p-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="relative block w-full rounded-lg border p-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="schoolNumber" className="block text-sm font-medium text-gray-700 mb-1">
                School Number
              </label>
              <input
                id="schoolNumber"
                type="text"
                required
                className="relative block w-full rounded-lg border p-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your school number"
                value={formData.schoolNumber}
                onChange={(e) => setFormData({ ...formData, schoolNumber: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="completedSemesters" className="block text-sm font-medium text-gray-700 mb-1">
                Completed School Semesters
              </label>
              <select
                id="completedSemesters"
                required
                className="relative block w-full rounded-lg border p-3 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.completedSemesters}
                onChange={(e) => setFormData({ ...formData, completedSemesters: e.target.value })}
              >
                <option value="">Select completed semesters</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester} {semester === 1 ? 'Semester' : 'Semesters'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                Major
              </label>
              <select
                id="major"
                required
                className="relative block w-full rounded-lg border p-3 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              >
                <option value="">Select your major</option>
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="curriculum" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Academic Curriculum (PDF only)
              </label>
              <input
                id="curriculum"
                type="file"
                accept=".pdf"
                required
                className="relative block w-full rounded-lg border p-3 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
