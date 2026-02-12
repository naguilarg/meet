import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = ({ isOpen, setIsOpen, setView }) => {
    // Isolated Meeting App Menu - Simplified or kept same for consistency
    // Keeping 'Reuniones' active here since this is the dedicated app
    const menuLinks = [
        { name: 'Nosotrxs', view: 'manifesto' },
        { name: 'Proyectos', view: 'projects' },
        { name: 'Contacto', view: 'contact' },
        { name: 'Reuniones', view: 'meet' },
    ];

    const containerVariants = {
        closed: {
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const linkVariants = {
        closed: { x: 50, opacity: 0 },
        open: { x: 0, opacity: 1, transition: { duration: 0.4 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={containerVariants}
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: '100%',
                        maxWidth: '600px', // Limit width on large screens
                        height: '100vh',
                        background: '#fff',
                        zIndex: 2000,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '60px'
                    }}
                >
                    <style>
                        {`
                            @media (max-width: 768px) {
                                .menu-nav-container {
                                    align-items: flex-start !important;
                                    padding-left: 20px !important;
                                }
                                .menu-link-text {
                                    font-size: 3.5rem !important;
                                }
                                .menu-footer-info {
                                    left: 40px !important;
                                    bottom: 30px !important;
                                    font-size: 0.6rem !important;
                                }
                                .menu-footer-links {
                                    display: none !important;
                                }
                            }
                        `}
                    </style>
                    <nav className="menu-nav-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {menuLinks.map((link) => (
                            <motion.div
                                key={link.name}
                                variants={linkVariants}
                                whileHover={{ x: 20, color: '#555' }} // Subtle hover effect
                                onClick={() => {
                                    setView(link.view);
                                    setIsOpen(false);
                                }}
                                style={{
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}
                            >
                                <h2 className="menu-link-text" style={{
                                    fontSize: '4.5rem',
                                    fontFamily: 'var(--font-serif)',
                                    textTransform: 'uppercase',
                                    color: '#000',
                                    lineHeight: '0.9',
                                    margin: 0
                                }}>
                                    {link.name}
                                </h2>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Menu Footer Info */}
                    <div className="menu-footer-info" style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '60px',
                        opacity: 0.5,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        zIndex: 2,
                        color: '#000'
                    }}>
                        <span>Colmillo Studio &copy; 2024</span>
                    </div>

                    <div className="menu-footer-links" style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '300px',
                        display: 'flex',
                        gap: '40px',
                        opacity: 0.5,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        zIndex: 2,
                        color: '#000'
                    }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Youtube</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Linkedin</a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Menu;
