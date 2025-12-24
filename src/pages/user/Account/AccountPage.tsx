import { PAGE_HEADER } from '~/assets/images';
import { Layout } from '~/shared/components/Layout/Layout';

const AccountPage = () => {
  return (
    <Layout>
      <div
        style={{
          backgroundImage: `url(${PAGE_HEADER})`,
        }}
        className="flex justify-center p-6 md:p-10 2xl:p-8 relative bg-no-repeat bg-center bg-cover"
      >
        <div className="absolute top-0 ltr:left-0 rtl:right-0 bg-black w-full h-full opacity-50 transition-opacity duration-500 group-hover:opacity-80"></div>
        <div className="w-full flex items-center justify-center relative z-10 py-10 md:py-14 lg:py-20 xl:py-24 2xl:py-32">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
            <span className="font-satisfy block font-normal mb-3">explore</span>
            My Account
          </h2>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
