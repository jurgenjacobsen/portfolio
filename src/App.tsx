import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Disclaimer from "@/components/sections/Disclaimer";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Socials from "@/pages/Socials";
import ProjectView from "@/pages/ProjectView";

function App() {
    return (
        <Router>
            <Disclaimer excludedPaths={["/socials"]} />
            <div className="max-w-6xl mx-auto p-4 font-sans min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 py-0 md:py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects/:projectSlug" element={<ProjectView />} />
                        <Route path="/projects" element={<Projects />} />

                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/socials" element={<Socials />} />

                        <Route path="*" element={<Home />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
