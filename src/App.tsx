import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotFound from "@/pages/NotFound";

import { Home, Projects, About, Contact, Socials } from "@/pages";

import { ProjectView } from "@/pages/subpages";

function App() {
    return (
        <Router>
            <div className="max-w-6xl mx-auto p-4 font-sans min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 py-0 md:py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/projects/:projectSlug"
                            element={<ProjectView />}
                        />
                        <Route path="/projects" element={<Projects />} />

                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/socials" element={<Socials />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
