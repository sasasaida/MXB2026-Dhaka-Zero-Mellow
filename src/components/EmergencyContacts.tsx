// src/components/EmergencyContacts.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { useEmergencyContacts } from '@/hooks/useEmergencyContacts';
import { useAuth } from '@/contexts/AuthContext';

export function EmergencyContacts() {
    const { user } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [newContact, setNewContact] = useState({
        name: '',
        phone: '',
        relationship: 'Family',
        isPrimary: false
    });

    const {
        contacts,
        addContact,
        removeContact,
        updateContact,
        sendEmergencyMessage
    } = useEmergencyContacts(user?.id || '');

    const handleAddContact = () => {
        if (!newContact.name || !newContact.phone) return;
        addContact(newContact);
        setNewContact({ name: '', phone: '', relationship: 'Family', isPrimary: false });
        setIsAdding(false);
    };

    const handleEmergencyMessage = () => {
        const message = "I need emergency assistance. Please check on me when you can.";
        // First message emergency services
        window.open('sms:999?body=' + encodeURIComponent(message), '_blank');
        // Then message emergency contacts
        sendEmergencyMessage(message);
    };

    return (
        <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Emergency Contacts
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAdding(!isAdding)}
                        className="text-destructive hover:bg-destructive/10"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        {isAdding ? 'Cancel' : 'Add Contact'}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {isAdding && (
                    <div className="space-y-3 p-4 bg-background rounded-lg border">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                placeholder="Contact name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                placeholder="+1 (123) 456-7890"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <select
                                id="relationship"
                                value={newContact.relationship}
                                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="Family">Family</option>
                                <option value="Friend">Friend</option>
                                <option value="Partner">Partner</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="isPrimary"
                                checked={newContact.isPrimary}
                                onChange={(e) => setNewContact({ ...newContact, isPrimary: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-destructive focus:ring-destructive"
                            />
                            <Label htmlFor="isPrimary" className="text-sm font-medium leading-none">
                                Primary Emergency Contact
                            </Label>
                        </div>
                        <Button
                            onClick={handleAddContact}
                            className="w-full mt-2 bg-destructive hover:bg-destructive/90"
                        >
                            Save Contact
                        </Button>
                    </div>
                )}

                <div className="space-y-2">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex items-center justify-between p-3 bg-background rounded-lg border"
                        >
                            <div>
                                <div className="font-medium flex items-center gap-2">
                                    {contact.name}
                                    {contact.isPrimary && (
                                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                                            Primary
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {contact.relationship} • {contact.phone}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeContact(contact.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 pt-2">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => window.open('tel:999', '_blank')}
                    >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Emergency: 999
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={handleEmergencyMessage}
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Alert Emergency Contacts
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}