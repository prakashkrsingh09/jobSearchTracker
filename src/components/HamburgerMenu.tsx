import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onAboutUs: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onResetPassword: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  visible,
  onClose,
  onAboutUs,
  onLogout,
  onDeleteAccount,
  onResetPassword,
}) => {
  const menuItems = [
    {
      id: 'about',
      title: 'About Us',
      icon: 'information-circle-outline',
      onPress: onAboutUs,
      color: '#007AFF',
    },
    {
      id: 'resetPassword',
      title: 'Reset Password',
      icon: 'key-outline',
      onPress: onResetPassword,
      color: '#34C759',
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out-outline',
      onPress: onLogout,
      color: '#FF9500',
    },
    {
      id: 'delete',
      title: 'Delete Account',
      icon: 'trash-outline',
      onPress: onDeleteAccount,
      color: '#FF3B30',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.menuContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>InterView Sync Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuItems}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
              >
                <Icon name={item.icon} size={24} color={item.color} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: item.color }]}>{item.title}</Text>
                <Icon name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: '80%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  menuItems: {
    paddingBottom: 20,
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    marginRight: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuIcon: {
    marginRight: 20,
    width: 28,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
});

export default HamburgerMenu;
