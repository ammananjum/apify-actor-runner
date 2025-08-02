import React, { useState } from 'react';
import axios from 'axios';

const HeroSection = () => {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState('');
  const [schema, setSchema] = useState(null);
const [formData, setFormData] = useState({});
const [resultUrl, setResultUrl] = useState('');
const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Validating...');

    try {
      const validateRes = await axios.post('https://6eca2de6-f60c-4a4e-a1cd-17548568ce9e-00-22hqj83u7oykr.pike.replit.dev/api/validate-key', { apiKey });
      setMessage(validateRes.data.message);

      const actorRes = await axios.post('https://6eca2de6-f60c-4a4e-a1cd-17548568ce9e-00-22hqj83u7oykr.pike.replit.dev/api/list-actors', { apiKey });
      setActors(actorRes.data.actors);

      if (actorRes.data.actors.length === 0) {
        setMessage('API Key is valid, but you have no actors.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Invalid API Key or error occurred.');
      setActors([]);
    }
  };
const handleActorSelect = async (e) => {
  const actorId = e.target.value;
  setSelectedActor(actorId);
  setSchema(null);
  setFormData({});
  setResultUrl('');

  if (!actorId) return;

  try {
    const schemaRes = await axios.post('https://6eca2de6-f60c-4a4e-a1cd-17548568ce9e-00-22hqj83u7oykr.pike.replit.dev/api/get-schema', {
      apiKey,
      actorId
    });
    setSchema(schemaRes.data.schema || {});
  } catch (error) {
    console.error('Failed to load schema', error);
  }
};

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="flex flex-col md:flex-row items-center justify-between min-h-[100vh] bg-white dark:bg-black px-8 md:px-20 py-15">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="bg-gray-200 dark:bg-gray-900 p-10 rounded-xl shadow-lg w-full max-w-xl mx-auto min-h-[400px] relative z-20">
            <h1 className="text-4xl font-extrabold text-center text-green-700 dark:text-green-400 mb-8">
              Apify Actor Runner
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-semibold mb-1 dark:text-white">Enter your Apify API Key:</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here"
                  className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-black dark:text-white dark:border-gray-600"
                />
              </div>
              <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded font-bold">
                Validate Key
              </button>
            </form>

            {message && <div className="mt-4 font-semibold text-center text-blue-700 dark:text-blue-300">{message}</div>}

            {actors.length > 0 && (
              <div className="mt-6">
                <label className="block font-semibold mb-1 dark:text-white">Select an Actor:</label>
                <select
                  value={selectedActor}
                  onChange={handleActorSelect}

                  className="w-full px-4 py-2 border border-gray-400 rounded dark:bg-black dark:text-white dark:border-gray-600"
                >
                  <option value="">-- Select Actor --</option>
                  {actors.map((actor) => (
                    <option key={actor.id} value={actor.id}>{actor.name}</option>
                  ))}
                </select>
                {schema && (
  <div className="mt-4 space-y-3">
    {Object.entries(schema.properties || {}).map(([key, value]) => (
      <div key={key}>
        <label className="block font-medium dark:text-white">{value.title || key}</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-black dark:text-white"
          value={formData[key] || ''}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          placeholder={value.description || ''}
        />
      </div>
    ))}
    <button
      onClick={async () => {
        setLoading(true);
        setResultUrl('');
        try {
          const runRes = await axios.post('https://6eca2de6-f60c-4a4e-a1cd-17548568ce9e-00-22hqj83u7oykr.pike.replit.dev/api/run-actor', {
            apiKey,
            actorId: selectedActor,
            input: formData
          });
          setResultUrl(runRes.data.runUrl);
        } catch (err) {
          console.error('Actor run failed', err);
          setResultUrl('Error running actor.');
        } finally {
          setLoading(false);
        }
      }}
      className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      {loading ? 'Running Actor...' : 'Run Actor'}
    </button>

    {resultUrl && (
      <div className="mt-3 text-sm text-center text-green-700 dark:text-green-300">
        {resultUrl.includes('http') ? (
          <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="underline">
            View Result on Apify
          </a>
        ) : resultUrl}
      </div>
    )}
  </div>
)}

              </div>
            )}
          </div>
        </div>

        {/* Diamond Visuals */}
        <div className="md:w-1/2 flex justify-center items-center space-x-8">
          {["/image1.gif", "/globe.gif"].map((src, idx) => (
            <div key={idx} className="relative w-[320px] h-[320px] animate-spinAround z-0">
              <div className="w-full h-full transform rotate-45 overflow-hidden bg-black shadow-md border-4 border-gray-300">
                <img src={src} alt="Diamond Visual" className="w-full h-full object-cover transform -rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen px-8 py-16 bg-white dark:bg-black">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">About This Project</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            {
              title: 'Project Overview',
              desc: `Apify Actor Runner is a web-based tool designed to simplify the process of running Apify actors. 
              It enables users to easily input their API keys, select their actors, and execute them within a clean and responsive interface. 
              Whether you're automating scraping or testing a workflow, this platform centralizes everything. 
              The goal is to make Apify more accessible even for non-technical users.`
            },
            {
              title: 'What Makes It Better?',
              desc: `Unlike plain API tools, this app features real-time validation, user feedback, and elegant visual feedback. 
              Users can see their actor list, input schemas, and execution results dynamically. 
              With JSON formatting, UI responsiveness, and animations, it enhances both usability and experience. 
              It’s a full-stack solution that balances function and form.`
            },
            {
              title: 'Tech Stack Used',
              desc: `The frontend is built using React.js and Tailwind CSS, offering flexibility and responsiveness. 
              Node.js with Express.js handles backend API calls securely. 
              It communicates with the official Apify API to fetch user data and execute actors. 
              The stack is lightweight yet powerful—perfect for modern automation platforms.`
            },
          ].map((box, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{box.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{box.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen px-8 py-16 bg-gradient-to-r from-green-700 to-gray-800 text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">Contact Us</h2>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-600 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-600 focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-600 focus:outline-none"
              rows="5"
            ></textarea>
            <button
              type="submit"
              className="bg-white text-green-800 font-bold px-6 py-3 rounded hover:bg-gray-200 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default HeroSection;    
