import React, {useEffect, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useAbility} from '../../hooks/useAbility';
import {RootState} from '../../redux/store';
import {restoreAuthState} from '../../redux/auth/authSlice';
import LoadingScreen from '../common/LoadingScreen';

interface RequireAuthProps {
  children: React.ReactElement;
  action: string;
  subject: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  action,
  subject,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {isAuthenticated, loading, user} = useSelector(
    (state: RootState) => state.auth
  );
  const ability = useAbility();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        await dispatch(restoreAuthState());
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (loading || isChecking) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/' state={{from: location}} replace />;
  }

  if (!ability.can(action, subject)) {
    return <Navigate to='/unauthorized' replace />;
  }

  return children;
};

export default RequireAuth;
