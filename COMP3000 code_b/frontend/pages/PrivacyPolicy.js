import React from 'react';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <div>
      <div className="policy-container">
        <h2>Privacy Policy</h2>
        <p>Last Updated: 27/11/2024</p>
        <h4>Information We Collect:</h4>
        <ul>
          <li>
            <strong>User Input:</strong> When you use the website to generate lyrics and melodies, we collect the information you provide (e.g., genre, lyric description). This information is used solely to generate the requested content and is not stored or used for any other purpose.
          </li>
          <li>
            <strong>Cookies:</strong> We may use cookies to improve user experience, such as remembering your preferences during a session. Cookies are temporary and are not used to store any personal data.
          </li>
        </ul>

        <h4>Data Usage:</h4>
        <p>Your input data is used to generate lyrics and melodies and is discarded after the process is complete. No personal data is stored.</p>

        <h4>Third-Party Services:</h4>
        <p>We may use third-party services (such as web hosting, analytics tools, etc.), which may collect non-personal data such as your IP address or browsing activity. These third parties have their own privacy policies.</p>

        <h4>Data Security:</h4>
        <p>We take reasonable precautions to protect the data you provide while using our site, but we cannot guarantee complete security.</p>

        <h4>Contact Us:</h4>
        <p>If you have any questions about our Privacy Policy, please contact us at <strong>[example email address]</strong>.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
