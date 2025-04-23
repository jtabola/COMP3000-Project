import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="custom-footer py-3 mt-5">
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <ul className="list-inline mb-0">
                        <li className="list-inline-item me-4">
                            <Link to="/about" className="text-decoration-none">About</Link>
                        </li>
                        <li className="list-inline-item me-4">
                            <Link to="/privacy-policy" className="text-decoration-none">Privacy Policy</Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="/terms-of-service" className="text-decoration-none">Terms of Service</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <Link to="/contact" className="text-decoration-none">Contact Us</Link>
                </div>
            </div>
            <div className="text-center mt-3">
                <p className="text-muted small mb-0">© 2024 Beat Fusion. All rights reserved.</p>
            </div>
        </div>
    </footer>
  );
}

export default Footer;