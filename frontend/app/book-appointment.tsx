import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'expert';
  timestamp: Date;
}

export default function BookAppointment() {
  const router = useRouter();
  const { colors } = useTheme();
  const { fontScale } = useFontSize();
  const [activeTab, setActiveTab] = useState<'form' | 'chat'>('form');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m a certified rainwater harvesting expert. How can I help you today?',
      sender: 'expert',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  useEffect(() => {
    if (activeTab === 'chat' && messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    }
  }, [messages, activeTab]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate expert response after 1.5 seconds
    setTimeout(() => {
      const expertResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. I\'ll get back to you shortly with more information about your query.',
        sender: 'expert',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, expertResponse]);
    }, 1500);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleBookAppointment = async () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.preferredDate || !formData.preferredTime) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/email/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Email API response:', data);

      if (data.success) {
        alert('Appointment request submitted! Our expert will contact you soon.');
        router.back();
      } else {
        alert('Failed to send appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error submitting appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.primary,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20 * fontScale,
      fontWeight: '700',
      color: '#FFFFFF',
      flex: 1,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 15 * fontScale,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    formContainer: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14 * fontScale,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    required: {
      color: colors.error || '#FF3B30',
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15 * fontScale,
      color: colors.text,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    submitButtonText: {
      fontSize: 16 * fontScale,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    chatContainer: {
      flex: 1,
    },
    messageList: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    messageWrapper: {
      marginBottom: 12,
      maxWidth: '80%',
    },
    userMessageWrapper: {
      alignSelf: 'flex-end',
    },
    expertMessageWrapper: {
      alignSelf: 'flex-start',
    },
    messageBubble: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    expertBubble: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 15 * fontScale,
      lineHeight: 20 * fontScale,
    },
    userText: {
      color: '#FFFFFF',
    },
    expertText: {
      color: colors.text,
    },
    timestamp: {
      fontSize: 11 * fontScale,
      color: colors.textSecondary,
      marginTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: 'center',
    },
    chatInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 15 * fontScale,
      color: colors.text,
      maxHeight: 100,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    infoBox: {
      backgroundColor: colors.primary + '15',
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      flex: 1,
      fontSize: 13 * fontScale,
      color: colors.text,
      marginLeft: 12,
      lineHeight: 18 * fontScale,
    },
  });

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageWrapper,
        item.sender === 'user' ? styles.userMessageWrapper : styles.expertMessageWrapper,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.expertBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.expertText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'form' && styles.activeTab]}
          onPress={() => setActiveTab('form')}
        >
          <Text style={[styles.tabText, activeTab === 'form' && styles.activeTabText]}>
            📋 Appointment Form
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            💬 Chat with Expert
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'form' ? (
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={0}
        >
          <ScrollView 
            style={styles.formContainer}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
              <Text style={styles.infoText}>
                Fill in your details below and our certified expert will contact you to schedule a
                site visit for rainwater harvesting assessment.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Phone Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Enter your address"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Date</Text>
              <TextInput
                style={styles.input}
                value={formData.preferredDate}
                onChangeText={(text) => setFormData({ ...formData, preferredDate: text })}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Time</Text>
              <TextInput
                style={styles.input}
                value={formData.preferredTime}
                onChangeText={(text) => setFormData({ ...formData, preferredTime: text })}
                placeholder="e.g., 10:00 AM - 12:00 PM"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Any specific requirements or questions?"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleBookAppointment}>
              <Text style={styles.submitButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.chatInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={inputText.trim() === ''}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
