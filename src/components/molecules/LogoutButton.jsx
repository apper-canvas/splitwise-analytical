import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      <ApperIcon name="LogOut" size={14} />
      <span className="text-xs">Logout</span>
    </Button>
  );
};

export default LogoutButton;