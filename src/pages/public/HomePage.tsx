import { Carousel, Flex, Form, Layout, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import classNames from 'classnames';
import { ReactElement, ReactNode } from 'react';
import { SwiperSlide } from 'swiper/react';

import {
  BAGS,
  BANNER_1_FEMALE_AUTUMN,
  BANNER_2_MALE_DENIM,
  BANNER_3_MALE_BLAZER,
  BANNER_4_MEN_COLLECTION,
  BANNER_5_KID_COLLECTION,
  BANNER_6_WOMEN_COLLECTION,
  BANNER_8_WINTER_COLLECTION,
  KIDS,
  MAN,
  MEN,
  NewSpringKnits,
  NewWinterKnits,
  ReadyToParty,
  SNEAKERS,
  SPORTS,
  SubscriptionBg,
  SUNGLASS,
  WATCH,
  WOMAN,
  WOMEN,
} from '~/assets/images';
import { Link } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import Swiper from '~/shared/components/Swiper/Swiper';
import { useBreakpoint } from '~/shared/hooks/useBreakpoint';

interface Category {
  key: string;
  icon: ReactNode;
  title: ReactNode;
  subTitle: ReactNode;
}

interface Product {
  key: string;
  cols?: number;
  rows?: number;
  title: ReactNode;
  subTitle: ReactNode;
  img: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
}

interface PageContent {
  key: string;
  title?: ReactNode;
  children: ReactElement;
}

interface TopBrand {
  key: string;
  brandSrc: string;
  backgroundSrc: string;
}

interface SpanClasses {
  cols: Record<number, string>;
  rows: Record<number, string>;
}

const spanClasses: SpanClasses = {
  cols: {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
  },
  rows: {
    1: 'row-span-1',
    2: 'row-span-2',
  },
};

const categories: Category[] = [
  {
    key: 'man',
    title: 'Đàn ông',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={41} height={41} src={MAN} alt="man" />,
  },
  {
    key: 'woman',
    title: 'Phụ nữ',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={29} height={49} src={WOMAN} alt="woman" />,
  },
  {
    key: 'watch',
    title: 'Đồng hồ',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={28.5} height={49} src={WATCH} alt="watch" />,
  },
  {
    key: 'kids',
    title: 'Trẻ em',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={28} height={41} src={KIDS} alt="kids" />,
  },
  {
    key: 'sports',
    title: 'Thể thao',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={41} height={41} src={SPORTS} alt="sports" />,
  },
  {
    key: 'sunglass',
    title: 'Kính râm',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={59} height={23} src={SUNGLASS} alt="sunglass" />,
  },
  {
    key: 'bags',
    title: 'Túi xách',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={37} height={41} src={BAGS} alt="bags" />,
  },
  {
    key: 'sneakers',
    title: 'Giày thể thao',
    subTitle: '5 thương hiệu, hơn 20 sản phẩm',
    icon: <Image width={59} height={29} src={SNEAKERS} alt="sneakers" />,
  },
];

const featuredProducts: Product[] = [
  {
    key: 'nike-bag',
    cols: 2,
    rows: 2,
    title: 'Túi Nike',
    subTitle:
      'Bộ máy Calibre 3235 Perpetual mạnh mẽ của Rolex. Một bản nâng cấp từ bộ máy Calibre 3135',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Ffeatured%2F1.png&w=640&q=75',
    discountRate: 20,
    price: 16.38,
    originalPrice: 20.38,
  },
  {
    key: 'adidas-woolen-cap',
    title: 'Mũ len Adidas',
    subTitle:
      'Trang phục thường ngày (trang phục thường ngày hoặc trang phục thường ngày) có thể là một kiểu trang phục phương Tây thoải mái, giản dị, tự nhiên và phù hợp với việc sử dụng hàng ngày. Trang phục thường ngày trở nên phổ biến trong thế giới phương Tây sau làn sóng phản văn hóa những năm 1960.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Ffeatured%2F2.png&w=640&q=75',
    discountRate: 20,
    price: 16,
    originalPrice: 20,
  },
  {
    key: 'nike-leader-vt',
    rows: 2,
    title: 'Nike Leader VT',
    subTitle:
      'Giày dép là loại quần áo được mang vào chân, ban đầu có mục đích bảo vệ khỏi những tác động của môi trường, thường liên quan đến kết cấu mặt đất và nhiệt độ.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Ffeatured%2F3.png&w=640&q=75',
    discountRate: 15,
    price: 16.38,
  },
  {
    key: 'aviator-ray-ban',
    title: 'Ray-ban Aviator',
    subTitle:
      'Kính râm phân cực giúp giảm độ chói phản chiếu từ đường, mặt nước, tuyết và các bề mặt nằm ngang khác. Khôi phục màu sắc trung thực. Tròng kính Vision có chỉ số chống tia UV là 400, nghĩa là có thể chặn bức xạ UVA và UVB.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Ffeatured%2F4.png&w=640&q=75',
    discountRate: 15,
    price: 850,
    originalPrice: 720,
  },
];

const flashSales: Product[] = [
  {
    key: 'sung-glass',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-27-md.png&w=384&q=100',
    title: 'Kính râm phân cực Wayfarer',
    subTitle:
      'Sản phẩm này chỉ được đổi sang sản phẩm có cùng kích thước hoặc kích thước khác nếu có và không được trả lại.',
    price: 20,
    originalPrice: 35,
  },
  {
    key: 'gucci-carlton',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-8-md.png&w=384&q=100',
    title: 'Gucci Carlton Anh',
    subTitle: 'Váy chữ A dệt kim dáng midi, cổ tròn, không tay, viền thẳng.',
    price: 14.99,
    originalPrice: 19.99,
  },
  {
    key: 'nike-shoes',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-24-md.png&w=384&q=100',
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    price: 50,
    originalPrice: 80,
  },
  {
    key: 'adidas-shoes',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-26-md.png&w=384&q=100',
    title: 'Giày Adidas màu đen',
    subTitle: 'Áo choàng không tay màu đen dành cho nam.',
    price: 45,
    originalPrice: 99.99,
  },
  {
    key: 'wide-legs-trousers',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-16-md.png&w=384&q=100',
    title: 'Quần ống rộng Armani',
    subTitle:
      'Sự thanh lịch đơn sắc. Chiếc quần ống rộng thoải mái này được làm từ chất liệu cotton hữu cơ mềm mại, bền vững với khả năng co giãn cơ học giúp sản phẩm dễ dàng tái chế.',
    price: 12,
    originalPrice: 16,
  },
  {
    key: 'zara-shoes',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-3.png&w=384&q=100',
    title: 'Giày Zara màu xanh lá cây',
    subTitle:
      'Giày dép là loại quần áo được mang vào chân, ban đầu có mục đích bảo vệ khỏi những tác động của môi trường, thường liên quan đến kết cấu mặt đất và nhiệt độ.',
    price: 50,
  },
  {
    key: 'tissot-classic',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-30-md.png&w=384&q=100',
    title: 'Tissot cổ điển',
    subTitle:
      'Mẫu Submariner mới hiện được trang bị bộ máy mạnh mẽ calibre 3235 Perpetual của Rolex. Là phiên bản nâng cấp từ bộ máy calibre 3135.',
    price: 600,
  },
];

const topBrands: TopBrand[] = [
  {
    key: 'fusion',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/fusion.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Ffusion-bg.jpg&w=640&q=75',
  },
  {
    key: 'vintage',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/sholy.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fsholy-bg.jpg&w=640&q=75',
  },
  {
    key: 'tyrant',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/tyrant.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Ftyrant-bg.jpg&w=640&q=75',
  },
  {
    key: 'fashadil',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/fashadil.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Ffashadil-bg.jpg&w=640&q=75',
  },
  {
    key: 'clothingegy',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/clothingegy.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fclothingegy-bg.jpg&w=640&q=75',
  },
  {
    key: 'shosio',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/shosio.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fshosio-bg.jpg&w=640&q=75',
  },
  {
    key: 'club-shoes',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/club-shoes.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fclub-shoes-bg.jpg&w=640&q=75',
  },
  {
    key: 'pop-clothing',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/pop-clothing.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fpop-clothing-bg.jpg&w=640&q=75',
  },
  {
    key: 'hoppister',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/hoppister.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fhoppister-bg.jpg&w=640&q=75',
  },
  {
    key: 'shovia',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/shovia.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fshovia-bg.jpg&w=640&q=75',
  },
  {
    key: 'shoozly',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/shoozly.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fshoozly-bg.jpg&w=640&q=75',
  },
  {
    key: 'blaze-fashion',
    brandSrc:
      'https://chawkbazar.vercel.app/assets/images/brands/grid/blaze-fashion.png',
    backgroundSrc:
      'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fbrands%2Fgrid%2Fblaze-fashion-bg.jpg&w=640&q=75',
  },
];

const topProducts: Product[] = [
  {
    key: 'maniac-red-boys',
    price: 15,
    originalPrice: 20,
    title: 'Maniac Red Boys',
    subTitle:
      'Quần short thể thao Under Armour là sản phẩm thiết yếu dành cho thể thao, mềm mại và nhẹ với chất liệu thấm hút ẩm.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-20-m.png&w=384&q=100',
  },
  {
    key: 'global-desi',
    price: 30,
    originalPrice: 40,
    title: 'H&M Global Desi',
    subTitle:
      'Áo dệt trơn màu xanh lam, viền cong với chi tiết tua rua có dây đeo vai và không tay.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-22-s.png&w=384&q=100',
  },
  {
    key: 'wayfarer',
    price: 20,
    originalPrice: 35,
    title: 'Kính râm phân cực Wayfarer',
    subTitle:
      'Sản phẩm này chỉ được đổi sang sản phẩm có cùng kích thước hoặc kích thước khác nếu có và không được trả lại.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-25-s.png&w=384&q=100',
  },
  {
    key: 'nike-shoes',
    price: 50,
    originalPrice: 80,
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-24-s.png&w=384&q=100',
  },
  {
    key: 'maniac-red-boys-2',
    price: 15,
    originalPrice: 20,
    title: 'Maniac Red Boys',
    subTitle:
      'Quần short thể thao Under Armour là sản phẩm thiết yếu dành cho thể thao, mềm mại và nhẹ với chất liệu thấm hút ẩm.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-20-m.png&w=384&q=100',
  },
  {
    key: 'nike-shoes-2',
    price: 50,
    originalPrice: 80,
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-24-s.png&w=384&q=100',
  },
];

const newArrivals: Product[] = [
  {
    key: '1',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F1.jpg&w=384&q=100',
  },
  {
    key: '2',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F3.jpg&w=384&q=100',
  },
  {
    key: '3',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F2.jpg&w=384&q=100',
  },
  {
    key: '4',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F4.jpg&w=384&q=100',
  },
  {
    key: '5',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F5.jpg&w=384&q=100',
  },
  {
    key: '6',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F6.jpg&w=384&q=100',
  },
  {
    key: '7',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F7.jpg&w=384&q=100',
  },
  {
    key: '8',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F8.jpg&w=384&q=100',
  },
  {
    key: '9',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F9.jpg&w=384&q=100',
  },
  {
    key: '10',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F10.jpg&w=384&q=100',
  },
];

const casualItems = [
  {
    key: 'spring',
    img: NewSpringKnits,
    title: 'Thời trang Len Thu Đông Mới',
    subTitle:
      'Những phong cách mới đa dạng, phong phú chào đón mùa xuân. Mùa này đang tươi sáng.',
  },
  {
    key: 'party',
    img: ReadyToParty,
    title: 'Sẵn Sàng Cho Bữa Tiệc',
    subTitle:
      'Từ phòng thu đến đường phố, bộ sưu tập năng động kỹ thuật, hiệu suất cao của chúng tôi được tạo ra.',
  },
  {
    key: 'winter',
    img: NewWinterKnits,
    title: 'Thời trang Len Mùa Đông',
    subTitle:
      'Những phong cách mới đa dạng, phong phú chào đón mùa xuân. Mùa này đang tươi sáng.',
  },
];

const HomePage = () => {
  const [subscriptionForm] = useForm();
  const { isSm, isMd, isLg, isXl } = useBreakpoint();

  const pageContents: PageContent[] = [
    {
      key: 'collections',
      children: (
        <div className="grid grid-cols-9 gap-2.5">
          <div className="relative col-span-5">
            <Image
              width="100%"
              height="100%"
              alt="banner-4"
              src={BANNER_4_MEN_COLLECTION}
              className="cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
            />
          </div>
          <span className="col-span-2">
            <Image
              width="100%"
              height="100%"
              alt="banner-5"
              src={BANNER_5_KID_COLLECTION}
              className="cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
            />
          </span>
          <span className="col-span-2">
            <Image
              width="100%"
              height="100%"
              alt="banner-6"
              src={BANNER_6_WOMEN_COLLECTION}
              className="cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
            />
          </span>
        </div>
      ),
    },
    {
      key: 'categories',
      title: 'Danh mục',
      children: (
        <Swiper
          loop
          autoplay
          spaceBetween={10}
          slidesPerView={isXl ? 7 : isLg ? 5 : isMd ? 4 : isSm ? 3 : 2}
        >
          {categories.map(({ key, icon, title, subTitle }) => (
            <SwiperSlide key={key}>
              <Flex
                vertical
                key={key}
                justify="center"
                className="relavite group rounded-lg px-6! lg:px-8! pt-7! lg:pt-10! pb-5! lg:pb-8! bg-[#f9f9f9] cursor-pointer"
              >
                <Flex
                  align="center"
                  className="relative ltr:mr-auto rtl:ml-auto h-16"
                >
                  {icon}
                </Flex>
                <Flex vertical>
                  <h4 className="text-heading text-sm md:text-base xl:text-lg font-semibold capitalize mb-1 select-none">
                    {title}
                  </h4>
                  <p className="text-sm sm:leading-6 leading-7 text-body pb-0.5 truncate select-none">
                    {subTitle}
                  </p>
                </Flex>
                <Flex
                  align="center"
                  justify="center"
                  className="absolute rounded-lg opacity-0 top-0 left-0 h-full w-full bg-[#787878] transition-all duration-300 ease-in-out group-has-hover:opacity-60"
                >
                  <Link />
                </Flex>
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
      ),
    },
    {
      key: 'featured-products',
      title: 'Sản phẩm nổi bật',
      children: (
        <div className="grid grid-cols-4 grid-rows-2 gap-7">
          {featuredProducts?.map((product) => (
            <Flex
              vertical
              key={product.key}
              className={classNames(
                'relative group bg-gray-100 rounded-md cursor-pointer',
                spanClasses?.cols[product?.cols || 1],
                spanClasses?.rows[product?.rows || 1]
              )}
            >
              <Flex align="center" justify="center" className="h-full">
                <Image
                  src={product?.img}
                  className="transition duration-300 ease-in-out group-has-hover:scale-115"
                />
              </Flex>
              <Flex
                align="center"
                justify="space-between"
                className="w-full px-7! pb-7! shrink-0"
              >
                <Flex vertical justify="space-between">
                  <h4 className="text-lg text-primary">{product?.title}</h4>
                  <p className="text-base text-body truncate max-w-[250px]">
                    {product?.subTitle}
                  </p>
                </Flex>
                <Flex vertical align="end">
                  {product?.originalPrice && (
                    <p className="text-lg text-body line-through">
                      {product?.originalPrice} $
                    </p>
                  )}
                  <p className="text-2xl text-primary font-semibold font-segoe">
                    {product?.price} $
                  </p>
                </Flex>
              </Flex>
              <p className="absolute pt-0.5 pb-1 px-3 bg-primary text-white rounded-md top-7 left-7">
                20%
              </p>
            </Flex>
          ))}
        </div>
      ),
    },
    {
      key: 'flash-sale',
      title: 'Flash sale',
      children: (
        <Swiper loop autoplay spaceBetween={10} slidesPerView={5}>
          {flashSales?.map(({ key, img, ...item }) => (
            <SwiperSlide key={key}>
              <ProductCard size="sm" imgSrc={img} {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      ),
    },
    {
      key: 'winter-collection',
      children: (
        <Image
          src={BANNER_8_WINTER_COLLECTION}
          alt="winter collection"
          className="cursor-pointer"
        />
      ),
    },
    {
      key: 'top-brands',
      title: 'Thương hiệu hàng đầu',
      children: (
        <div className="grid grid-cols-6 gap-7">
          {topBrands?.map((topBrand) => (
            <Flex
              justify="center"
              key={topBrand?.key}
              className="group flex text-center relative overflow-hidden rounded-md cursor-pointer"
            >
              <span
                style={{
                  width: 'initial',
                  height: 'initial',
                }}
                className="relative inline-block overflow-hidden bg-none opacity-100 max-w-full"
              >
                <span
                  style={{
                    width: 'initial',
                    height: 'initial',
                  }}
                  className="block bg-none opacity-100 max-w-full"
                >
                  <img
                    style={{
                      width: 'initial',
                      height: 'initial',
                    }}
                    className="block bg-none opacity-100 max-w-full"
                    src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27428%27%20height=%27428%27/%3e"
                  />
                </span>
                <img
                  src={topBrand?.backgroundSrc}
                  className="block absolute inset-0 min-w-full max-w-full min-h-full max-h-full rounded-md object-cover transform transition-transform ease-in-out duration-500 group-has-hover:rotate-6 group-has-hover:scale-125"
                />
              </span>
              <div className="absolute top-0 left-0 bg-black w-full h-full opacity-50 transition-opacity duration-500 group-has-hover:opacity-80"></div>
              <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center p-8">
                <img className="shrink-0" src={topBrand?.brandSrc} />
              </div>
            </Flex>
          ))}
        </div>
      ),
    },
    {
      key: 'top-products',
      title: 'Sản phẩm hàng đầu',
      children: (
        <div className="grid grid-cols-3 gap-7">
          {topProducts?.map((topProduct) => (
            <Flex
              key={topProduct.key}
              className="group col-span-1 bg-[#f9f9f9] cursor-pointer"
            >
              <div className="flex shrink-0 w-64 max-h-64 overflow-hidden">
                <Image
                  src={topProduct?.img}
                  className="transition-all duration-300 ease-in-out group-has-hover:scale-110"
                />
              </div>
              <Flex vertical justify="center" className="p-2! pl-10!">
                <h4 className="font-semibold text-lg text-primary mb-1.5">
                  {topProduct?.title}
                </h4>
                <p className="truncate text-body max-w-[250px]">
                  {topProduct?.subTitle}
                </p>
                <Flex className="mt-3! gap-x-2">
                  <p className="font-semibold text-xl text-primary">
                    {topProduct?.price}$
                  </p>
                  <p className="line-through text-body">
                    {topProduct?.originalPrice}$
                  </p>
                </Flex>
              </Flex>
            </Flex>
          ))}
        </div>
      ),
    },
    {
      key: 'shop-by-gender',
      children: (
        <div className="rounded-md overflow-hidden">
          <Flex justify="space-between">
            <Flex
              align="end"
              justify="center"
              className="relative group w-1/2 bg-gray-100"
            >
              <Image
                src={WOMEN}
                className="transition-all duration-200 ease-in-out group-has-hover:scale-105"
              />
              <Button
                displayType="outlined"
                title="#dành riêng cho phụ nữ"
                className="absolute left-7 top-7 text-xl uppercase py-7! px-8! shadow-product hover:bg-primary! hover:text-white! hover:border-primary!"
              />
              <p className="absolute right-7 top-24 uppercase leading-5 tracking-widest text-3xl text-primary opacity-10 select-none">
                new year
              </p>
              <p className="absolute right-0 top-16 tracking-widest font-bold text-[240px] text-primary opacity-5 select-none">
                20
              </p>
            </Flex>
            <Flex
              align="end"
              justify="center"
              className="relative group w-1/2 bg-[#ece7e3]"
            >
              <Image
                src={MEN}
                className="transition-all duration-200 ease-in-out group-has-hover:scale-105"
              />
              <Button
                displayType="outlined"
                title="#dành riêng cho nam giới"
                className="absolute right-7 top-7 text-xl uppercase py-7! px-8! shadow-product hover:bg-primary! hover:text-white! hover:border-primary!"
              />
              <p className="absolute left-7 top-24 uppercase leading-5 tracking-widest text-3xl text-primary opacity-10 select-none">
                exclusive
              </p>
              <p className="absolute left-5 top-16 tracking-widest font-bold text-[240px] text-primary opacity-5 select-none">
                26
              </p>
            </Flex>
          </Flex>
        </div>
      ),
    },
    {
      key: 'new-arrivals',
      title: 'Sản phẩm mới',
      children: (
        <div className="grid grid-cols-5 gap-x-7 gap-y-8">
          {newArrivals?.map(({ key, img, ...product }) => (
            <ProductCard key={key} effect="lift" imgSrc={img} {...product} />
          ))}
        </div>
      ),
    },
    {
      key: 'casual',
      children: (
        <div className="grid grid-cols-3 gap-x-7">
          {casualItems.map((item) => (
            <Flex
              vertical
              key={item.key}
              className="group col-span-1 gap-y-7 cursor-pointer hover:opacity-85 transition-all duration-300 ease-in-out"
            >
              <div className="relative overflow-hidden">
                <Image src={item?.img} className="rounded-md" />
                <Button
                  displayType="outlined"
                  title="Khám phá bộ sưu tập"
                  className="absolute w-max -bottom-10 right-10 transition-all duration-300 ease-in-out group-has-hover:bottom-10"
                />
              </div>
              <Flex vertical justify="center" align="center">
                <h4 className="font-bold text-primary text-3xl capitalize mb-3.5">
                  {item?.title}
                </h4>
                <p className="leding-7 text-body text-center px-20">
                  {item?.subTitle}
                </p>
              </Flex>
            </Flex>
          ))}
        </div>
      ),
    },
    {
      key: 'subscription',
      children: (
        <Flex
          vertical
          className="relative bg-[#f9f9f9] rounded-md py-16! px-24! overflow-hidden"
        >
          <h3 className="font-bold text-3xl text-primary mb-3.5">
            Nhận lời khuyên của chuyên gia trong hộp thư đến của bạn
          </h3>
          <p className="text-sm text-body leading-7">
            Đăng ký nhận bản tin của chúng tôi và cập nhật thông tin mới nhất.
          </p>
          <Form
            layout="inline"
            className="mt-7! z-10"
            form={subscriptionForm}
            onFinish={(values) => console.log(values)}
          >
            <FormItem className="w-[545px]">
              <Input
                placeholder="Nhập email của bạn tại đây"
                className="h-14"
              />
            </FormItem>
            <Button
              title="Đăng ký"
              className="h-14 py-4! px-8!"
              onClick={() => console.log('subscription')}
            />
          </Form>
          <div
            style={{ backgroundImage: `url(${SubscriptionBg})` }}
            className="absolute w-full h-full right-0 top-0 bg-contain bg-right bg-no-repeat z-0"
          ></div>
        </Flex>
      ),
    },
  ];

  return (
    <Layout className="bg-white! min-h-screen">
      <Carousel
        arrows
        draggable
        autoplay={{ dotDuration: true }}
        autoplaySpeed={5000}
      >
        <Image
          alt="banner-1"
          src={BANNER_1_FEMALE_AUTUMN}
          className="cursor-pointer"
        />
        <Image
          alt="banner-2"
          src={BANNER_2_MALE_DENIM}
          className="cursor-pointer"
        />
        <Image
          alt="banner-3"
          src={BANNER_3_MALE_BLAZER}
          className="cursor-pointer"
        />
      </Carousel>

      <Space
        direction="vertical"
        className="mt-14 px-16 max-w-[1920px] gap-y-16!"
      >
        {pageContents?.map(({ key, title, children }) => {
          if (title)
            return (
              <div key={key}>
                <h3 className="font-bold text-3xl text-primary mb-8 capitalize">
                  {title}
                </h3>
                {children}
              </div>
            );

          return children;
        })}
      </Space>
    </Layout>
  );
};

export default HomePage;
