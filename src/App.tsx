import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useParams,
} from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
    Home,
    Code,
    CodeView,
    Contact,
    Socials,
    CV,
    Aviation,
    Photos,
    Guides,
    Blueprint,
    NotFound,
} from "@/pages";
import { ScrollToTop } from "@/components/shared";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminGuard from "@/components/admin/AdminGuard";

function ProjectRedirect() {
    const { projectSlug } = useParams();
    return (
        <Navigate to={projectSlug ? `/code/${projectSlug}` : "/code"} replace />
    );
}

function GuideRedirect() {
    const { slug } = useParams();
    return (
        <Navigate to={slug ? `/guides/${slug}` : "/guides"} replace />
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
                        <Route path="/photos" element={<Photos />} />
                        <Route path="/guides/:slug" element={<Guides />} />
                        <Route path="/guides" element={<Guides />} />
                        <Route
                            path="/guide/:slug"
                            element={<GuideRedirect />}
                        />
                        <Route
                            path="/guide"
                            element={<Navigate to="/guides" replace />}
                        />
                        <Route path="/blueprint" element={<Blueprint />} />
                        <Route
                            path="/boilerplate"
                            element={<Navigate to="/blueprint" replace />}
                        />

                        <Route path="/contact" element={<Contact />} />
                        <Route path="/socials" element={<Socials />} />

                        <Route path="/cv" element={<CV />} />

                        {/* Admin CMS Console */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                            path="/admin"
                            element={
                                <AdminGuard>
                                    <AdminDashboard />
                                </AdminGuard>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
