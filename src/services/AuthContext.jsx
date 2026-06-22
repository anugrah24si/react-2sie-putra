import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch profile from profiles table
    async function fetchProfile(userId) {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
            return null;
        }
        return data;
    }

    // Initialize auth state
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id).then((p) => {
                    setProfile(p);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_IN" && session?.user) {
                    setUser(session.user);
                    const p = await fetchProfile(session.user.id);
                    setProfile(p);
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Sign out
    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    }

    // Refresh profile data
    async function refreshProfile() {
        if (user) {
            const p = await fetchProfile(user.id);
            setProfile(p);
        }
    }

    const value = {
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
