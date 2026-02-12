import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, Video, X } from 'lucide-react';
import MinimalLogo from './MinimalLogo';

const Meet = ({ setCurrentView }) => {
    // State for Lobby vs Meeting
    const [inMeeting, setInMeeting] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [userName, setUserName] = useState("");
    
    // Admin / Setup States
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [adminPasswordInput, setAdminPasswordInput] = useState("");
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    
    // Room Configuration (Admin Only)
    const [newRoomPassword, setNewRoomPassword] = useState("");
    const [enableLobby, setEnableLobby] = useState(true);

    // Jitsi API Ref
    const jitsiRef = useRef(null);
    const jitsiApiRef = useRef(null);

    // 1. Load Jitsi Script Dynamically
    useEffect(() => {
        if (!window.JitsiMeetExternalAPI) {
            const script = document.createElement("script");
            script.src = "https://meet.colmillo.es/external_api.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // 2. Initialize Meeting
    useEffect(() => {
        if (inMeeting && window.JitsiMeetExternalAPI) {
            const domain = "meet.colmillo.es";
            
            // Generate a secure or simple room name if input is empty, though UI enforces it.
            const finalRoomName = roomName || "SalaColmilloGenerica";

            const options = {
                roomName: finalRoomName,
                width: '100%',
                height: '100%',
                parentNode: jitsiRef.current,
                userInfo: {
                    displayName: userName || "Invitado Colmillo"
                },
                configOverwrite: {
                    prejoinPageEnabled: false,
                    startWithAudioMuted: true,
                    startWithVideoMuted: true,
                    // If Admin enabled lobby for this session creation:
                    // Note: 'lobby' param in config might require admin rights on Jitsi side or specific implementation.
                    // Standard Jitsi meet.jit.si supports password setting after join.
                },
                interfaceConfigOverwrite: {
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_BACKGROUND: '#000000',
                    DEFAULT_LOCAL_DISPLAY_NAME: 'Yo',
                }
            };

            const api = new window.JitsiMeetExternalAPI(domain, options);
            jitsiApiRef.current = api;

            // Event Listeners
            api.addEventListeners({
                readyToClose: () => {
                   handleHangup();
                },
                videoConferenceJoined: () => {
                    // If Admin, set password immediately
                    if (isAdminAuthenticated && newRoomPassword) {
                        api.executeCommand('password', newRoomPassword);
                        // api.executeCommand('toggleLobby', true); // Try to enable lobby if supported/authorized
                    }
                }
            });
        }
        
        // Cleanup
        return () => {
            if (jitsiApiRef.current) {
                jitsiApiRef.current.dispose();
                jitsiApiRef.current = null;
            }
        };
    }, [inMeeting]); 
    // Effect dependency note: logic inside only runs when inMeeting becomes true.

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomName && userName) {
            setInMeeting(true);
        }
    };

    const handleHangup = () => {
        setInMeeting(false);
        if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
        }
    };

    const handleAdminUnlock = () => {
        // Simple client-side check for demonstration. 
        // In detailed implementation, this might hit an API endpoint.
        if (adminPasswordInput === 'colmillo2024') {
            setIsAdminAuthenticated(true);
            setAdminPasswordInput('');
        } else {
            alert("Contraseña incorrecta");
        }
    };

    // --- RENDER ---

    if (inMeeting) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#000',
                    zIndex: 2000
                }}
            >
                {/* Custom Overlay Header for "Exit" */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 2010
                }}>
                     <MinimalLogo />
                </div>
                
                <button 
                    onClick={handleHangup}
                    style={{
                        position: 'absolute',
                        top: '30px',
                        right: '30px',
                        zIndex: 2010,
                        color: 'white',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        letterSpacing: '2px'
                    }}
                >
                    <X size={16} /> Salir
                </button>

                <div ref={jitsiRef} style={{ width: '100%', height: '100%' }} />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#000',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
             {/* Background Ambience */}
             <div style={{
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 width: '100%',
                 height: '100%',
                 background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 70%)',
                 zIndex: 0
             }} />

             {/* Close Button to return to App */}
             <button 
                onClick={() => setCurrentView('home')}
                style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    zIndex: 20,
                    opacity: 0.7,
                    transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.7}
             >
                 <X size={24} />
             </button>

             {/* Admin Trigger (Subtle) */}
             <button
                onClick={() => setShowAdminPanel(true)}
                style={{
                    position: 'absolute',
                    top: '40px',
                    left: '50%', // Centered or hidden somewhere distinct
                    transform: 'translateX(-50%)', // Actually, let's put it top right next to close for now, or just somewhere accessible
                    zIndex: 20,
                    opacity: 0.2, // Very subtle
                }}
                className="admin-lock-icon"
             >
                 <Lock size={16} />
             </button>
             <style>{`
                 .admin-lock-icon:hover { opacity: 1 !important; }
             `}</style>

             <div style={{ zIndex: 10, maxWidth: '500px', width: '90%', textAlign: 'center' }}>
                 <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                 >
                     <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '10px' }}>
                        Reuniones
                     </h1>
                     <p style={{ opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '50px' }}>
                         Espacio de colaboración privado
                     </p>
                 </motion.div>

                 <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div style={{ position: 'relative' }}>
                         <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                         <input 
                            type="text" 
                            placeholder="Tu Nombre"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px 15px 15px 45px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '5px',
                                color: '#fff',
                                outline: 'none',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '1rem'
                            }}
                         />
                     </div>

                     <div style={{ position: 'relative' }}>
                         <Video size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                         <input 
                            type="text" 
                            placeholder="Nombre de la Sala"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px 15px 15px 45px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '5px',
                                color: '#fff',
                                outline: 'none',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '1rem'
                            }}
                         />
                     </div>

                     <button 
                        type="submit"
                        disabled={!userName || !roomName}
                        style={{
                            marginTop: '20px',
                            background: '#fff',
                            color: '#000',
                            padding: '15px',
                            borderRadius: '5px',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            fontWeight: '600',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            opacity: (!userName || !roomName) ? 0.5 : 1,
                            cursor: (!userName || !roomName) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s'
                        }}
                     >
                         Entrar <ArrowRight size={18} />
                     </button>
                 </form>
             </div>

             {/* ADMIN MODAL */}
             <AnimatePresence>
                 {showAdminPanel && (
                     <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 100,
                            background: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                     >
                         <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                background: '#111',
                                border: '1px solid #333',
                                padding: '40px',
                                position: 'relative'
                            }}
                         >
                             <button
                                onClick={() => { setShowAdminPanel(false); setIsAdminAuthenticated(false); }}
                                style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.5 }}
                             >
                                 <X size={20} />
                             </button>

                             {!isAdminAuthenticated ? (
                                 <div style={{ textAlign: 'center' }}>
                                     <Lock size={30} style={{ marginBottom: '20px', opacity: 0.7 }} />
                                     <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>Admin Access</h3>
                                     <input 
                                        type="password"
                                        placeholder="Contraseña Maestra"
                                        value={adminPasswordInput}
                                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            background: '#222',
                                            border: 'none',
                                            color: '#fff',
                                            marginBottom: '20px',
                                            textAlign: 'center'
                                        }}
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleAdminUnlock()}
                                     />
                                     <button
                                        onClick={handleAdminUnlock}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #444',
                                            color: '#fff',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            fontSize: '0.7rem'
                                        }}
                                     >
                                         Desbloquear
                                     </button>
                                 </div>
                             ) : (
                                 <div>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: '#4caf50' }}>
                                         <ShieldCheck size={20} />
                                         <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Admin Verificado</span>
                                     </div>

                                     <div style={{ marginBottom: '20px' }}>
                                          <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6, marginBottom: '5px' }}>
                                              Nombre de Sala
                                          </label>
                                          <input 
                                            type="text" 
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #333', color: '#fff' }}
                                          />
                                     </div>

                                     <div style={{ marginBottom: '20px' }}>
                                          <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6, marginBottom: '5px' }}>
                                              Contraseña de Sala
                                          </label>
                                          <input 
                                            type="text"
                                            value={newRoomPassword}
                                            onChange={(e) => setNewRoomPassword(e.target.value)}
                                            placeholder="Opcional"
                                            style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #333', color: '#fff' }}
                                          />
                                     </div>

                                     <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                         <input 
                                            type="checkbox"
                                            checked={enableLobby}
                                            onChange={(e) => setEnableLobby(e.target.checked)}
                                         />
                                         <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Habilitar Lobby (Sala de Espera)</label>
                                     </div>

                                     <button
                                        onClick={(e) => {
                                            if(!userName) setUserName("Admin"); // Default admin name
                                            handleJoin(e);
                                            setShowAdminPanel(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            background: '#fff',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px'
                                        }}
                                     >
                                         Crear / Entrar
                                     </button>
                                 </div>
                             )}
                         </motion.div>
                     </motion.div>
                 )}
             </AnimatePresence>
        </motion.div>
    );
};

export default Meet;
