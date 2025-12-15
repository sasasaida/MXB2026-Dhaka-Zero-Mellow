// src/hooks/useEmergencyContacts.ts
import { useState, useEffect } from 'react';
import { EmergencyContact } from '@/types/emergency';

const EMERGENCY_CONTACTS_KEY = 'emergency_contacts';

export const useEmergencyContacts = (userId: string) => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadContacts();
    }, [userId]);

    const loadContacts = () => {
        const saved = localStorage.getItem(`${EMERGENCY_CONTACTS_KEY}_${userId}`);
        setContacts(saved ? JSON.parse(saved) : []);
        setIsLoading(false);
    };

    const saveContacts = (newContacts: EmergencyContact[]) => {
        localStorage.setItem(
            `${EMERGENCY_CONTACTS_KEY}_${userId}`,
            JSON.stringify(newContacts)
        );
        setContacts(newContacts);
    };

    const addContact = (contact: Omit<EmergencyContact, 'id'>) => {
        const newContact = { ...contact, id: Date.now().toString() };
        saveContacts([...contacts, newContact]);
    };

    const removeContact = (id: string) => {
        saveContacts(contacts.filter(c => c.id !== id));
    };

    const updateContact = (id: string, updates: Partial<EmergencyContact>) => {
        saveContacts(
            contacts.map(c => (c.id === id ? { ...c, ...updates } : c))
        );
    };

    const sendEmergencyMessage = (message: string) => {
        const primaryContacts = contacts.filter(c => c.isPrimary);
        if (primaryContacts.length === 0) return;

        // Open messaging app for each primary contact
        primaryContacts.forEach(contact => {
            window.open(`sms:${contact.phone}?body=${encodeURIComponent(message)}`, '_blank');
        });
    };

    return {
        contacts,
        isLoading,
        addContact,
        removeContact,
        updateContact,
        sendEmergencyMessage
    };
};
