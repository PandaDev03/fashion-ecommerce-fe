import { useGoogleLogin } from '@react-oauth/google';
import { Image } from 'antd';
import { memo } from 'react';

import { GOOGLE_LOGO } from '~/assets/images';
import Button from './Button';

interface IProps {
  title?: string;
  loading?: boolean;
  onClick: (value: any) => void;
}

const GoogleAuthButton = ({
  loading,
  title = 'Đăng nhập bằng Google',
  onClick,
}: IProps) => {
  const handleSignIn = useGoogleLogin({
    onSuccess: async (response) => {
      console.log(response);

      // try {
      //   const userInfo = await fetchGoogleUserInfo({ response });
      //   if (!userInfo) {
      //     toast.error('Có lỗi xảy ra khi lấy thông tin từ Google!');
      //     return;
      //   }
      //   const params: IUserSignInWithGoogle = {
      //     email: userInfo.email,
      //     fullName: userInfo.name,
      //     avatarURL: userInfo.picture,
      //   };
      //   onClick(params);
      // } catch (error) {
      //   console.log(error);
      // }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Button
      title={title}
      loading={loading}
      iconBefore={
        <Image preview={false} src={GOOGLE_LOGO} width={24} height={24} />
      }
      className="w-full text-[#3c4043] border-[#dadce0] hover:border-[#d2e3fc] hover:bg-[#f7fafe]"
      onClick={() => handleSignIn()}
    />
  );
};

export default memo(GoogleAuthButton);
