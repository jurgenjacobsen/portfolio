import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useParams,
} from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotFound from "@/pages/NotFound";

import { Home, Code, Contact, Socials, CV, Charts, Aviation, Photos, Guides } from "@/pages";
import { CodeView } from "@/pages/subpages";
import { ScrollToTop } from "@/components/shared";

function ProjectRedirect() {
    const { projectSlug } = useParams();
    return (
        <Navigate
            to={projectSlug ? `/code/${projectSlug}` : "/code"}
            replace
        />
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="max-w-6xl mx-auto p-4 font-sans min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 py-0 md:py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/code/:projectSlug"
                            element={<CodeView />}
                        />
                        <Route path="/code" element={<Code />} />
                        <Route
                            path="/projects/:projectSlug"
                            element={<ProjectRedirect />}
                        />
                        <Route
                            path="/projects"
                            element={<Navigate to="/code" replace />}
                        />
                        <Route path="/aviation" element={<Aviation />} />
                        <Route path="/charts" element={<Charts />} />
                        <Route path="/photos" element={<Photos />} />
                        <Route path="/guides" element={<Guides />} />

                        <Route path="/contact" element={<Contact />} />
                        <Route path="/socials" element={<Socials />} />
                        
                        <Route path="/cv" element={<CV />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
