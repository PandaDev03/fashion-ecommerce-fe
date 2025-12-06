import { Carousel, Flex, Space } from 'antd';
import classNames from 'classnames';
import { ReactElement, ReactNode, useState } from 'react';
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
  SUNGLASS,
  WATCH,
  WOMAN,
  WOMEN,
} from '~/assets/images';
import { Link } from '~/assets/svg';
import { MAX_QUANTITY, MIN_QUANTITY } from '~/config/constants';
import Button from '~/shared/components/Button/Button';
import Image from '~/shared/components/Image/Image';
import { Layout } from '~/shared/components/Layout/Layout';
import ProductModal, { Size } from '~/shared/components/Modal/ProductModal';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import Swiper from '~/shared/components/Swiper/Swiper';
import useBreakpoint from '~/shared/hooks/useBreakpoint';

interface Category {
  key: string;
  icon: ReactNode;
  title: ReactNode;
  subTitle: ReactNode;
}

export interface Product {
  key?: string;
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
  children: ReactElement | (() => ReactElement);
}

interface TopBrand {
  key: string;
  brandSrc: string;
  backgroundSrc: string;
}

interface Casual {
  key: string;
  img: string;
  title: string;
  subTitle: string;
}

interface SpanClasses {
  cols: Record<number, string>;
  rows: Record<number, string>;
}

const spanClasses: SpanClasses = {
  cols: {
    1: 'col-span-1',
    2: 'lg:col-span-2',
  },
  rows: {
    1: 'lg:row-span-1',
    2: 'lg:row-span-2',
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
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-25-m.png',
    title: 'Kính râm phân cực Wayfarer',
    subTitle:
      'Sản phẩm này chỉ được đổi sang sản phẩm có cùng kích thước hoặc kích thước khác nếu có và không được trả lại.',
    price: 20,
    originalPrice: 35,
  },
  {
    key: 'gucci-carlton',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-8-m.png',
    title: 'Gucci Carlton Anh',
    subTitle: 'Váy chữ A dệt kim dáng midi, cổ tròn, không tay, viền thẳng.',
    price: 14.99,
    originalPrice: 19.99,
  },
  {
    key: 'nike-shoes',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-24-m.png',
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    price: 50,
    originalPrice: 80,
  },
  {
    key: 'adidas-shoes',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-26-m.png',
    title: 'Giày Adidas màu đen',
    subTitle: 'Áo choàng không tay màu đen dành cho nam.',
    price: 45,
    originalPrice: 99.99,
  },
  {
    key: 'wide-legs-trousers',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-16-m.png',
    title: 'Quần ống rộng Armani',
    subTitle:
      'Sự thanh lịch đơn sắc. Chiếc quần ống rộng thoải mái này được làm từ chất liệu cotton hữu cơ mềm mại, bền vững với khả năng co giãn cơ học giúp sản phẩm dễ dàng tái chế.',
    price: 12,
    originalPrice: 16,
  },
  {
    key: 'zara-shoes',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-3-m.png',
    title: 'Giày Zara màu xanh lá cây',
    subTitle:
      'Giày dép là loại quần áo được mang vào chân, ban đầu có mục đích bảo vệ khỏi những tác động của môi trường, thường liên quan đến kết cấu mặt đất và nhiệt độ.',
    price: 50,
  },
  {
    key: 'tissot-classic',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-30-m.png',
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
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-22-m.png',
  },
  {
    key: 'wayfarer',
    price: 20,
    originalPrice: 35,
    title: 'Kính râm phân cực Wayfarer',
    subTitle:
      'Sản phẩm này chỉ được đổi sang sản phẩm có cùng kích thước hoặc kích thước khác nếu có và không được trả lại.',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-25-m.png',
  },
  {
    key: 'nike-shoes',
    price: 50,
    originalPrice: 80,
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-24-m.png',
  },
  {
    key: 'maniac-red-boys-2',
    price: 15,
    originalPrice: 20,
    title: 'Maniac Red Boys',
    subTitle:
      'Quần short thể thao Under Armour là sản phẩm thiết yếu dành cho thể thao, mềm mại và nhẹ với chất liệu thấm hút ẩm.',
    img: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/475367/item/vngoods_58_475367_3x4.jpg?width=369',
  },
  {
    key: 'nike-shoes-2',
    price: 50,
    originalPrice: 80,
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    img: 'https://chawkbazar.vercel.app/assets/images/products/p-24-m.png',
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

const casualItems: Casual[] = [
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

const shopByGender = [
  {
    key: '1',
    year: 20,
    img: WOMEN,
    title: 'new year',
    buttonTitle: '#dành riêng cho phụ nữ',
    resButtonTitle: '#dành cho nữ',
  },
  {
    key: '2',
    year: 26,
    img: MEN,
    title: 'exclusive',
    buttonTitle: '#dành riêng cho nam giới',
    resButtonTitle: '#dành cho nam',
  },
];

const HomePage = () => {
  const { is2Xs, isSm, isMd, isLg, isXl } = useBreakpoint();

  const [isOpen, setIsOpen] = useState(false);

  const [color, setColor] = useState('');
  const [size, setSize] = useState<Size>();
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    {} as Product
  );

  const pageContents: PageContent[] = [
    {
      key: 'collections',
      children: (
        <div className="grid grid-cols-2 sm:grid-cols-9 gap-2.5">
          <div className="relative col-span-2 sm:col-span-5">
            <Image
              width="100%"
              height="100%"
              alt="banner-4"
              src={BANNER_4_MEN_COLLECTION}
              className="cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
            />
          </div>
          <span className="col-span-1 sm:col-span-2">
            <Image
              width="100%"
              height="100%"
              alt="banner-5"
              src={BANNER_5_KID_COLLECTION}
              className="cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
            />
          </span>
          <span className="col-span-1 sm:col-span-2">
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
          arrows
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
                  <h4 className="text-heading text-sm md:text-base xl:text-lg font-semibold capitalize mb-1 select-none truncate">
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
        <div className="grid grid-rows-2 grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 xl:gap-7">
          {featuredProducts?.map((product) => (
            <Flex
              vertical
              key={product.key}
              className={classNames(
                'relative group bg-gray-100 rounded-md cursor-pointer',
                spanClasses?.cols[product?.cols || 1],
                spanClasses?.rows[product?.rows || 1]
              )}
              onClick={() => handleSelectedProduct(product)}
            >
              <Flex align="center" justify="center" className="h-full">
                <Image
                  src={product?.img}
                  className="transition duration-300 ease-in-out group-has-hover:scale-115"
                />
              </Flex>
              <Flex
                justify="space-between"
                className="items-center overflow-hidden w-full px-7! pb-7! max-2xl:px-4! max-2xl:pb-4! shrink-0 max-2xl:flex-col max-2xl:items-start"
              >
                <Flex vertical justify="space-between" className="w-full">
                  <h4 className="text-sm font-semibold truncate md:text-base xl:text-lg text-primary max-2xl:mb-1">
                    {product?.title}
                  </h4>
                  <p className="text-sm max-2xl:text-xs text-body truncate max-w-[250px]">
                    {product?.subTitle}
                  </p>
                </Flex>
                <Flex className="flex-col items-end max-2xl:items-start max-2xl:flex-row-reverse max-2xl:gap-x-2">
                  {product?.originalPrice && (
                    <p className="text-lg max-2xl:text-sm text-body line-through">
                      {product?.originalPrice}$
                    </p>
                  )}
                  <p className="max-2xl:text-base text-2xl text-primary font-semibold font-segoe">
                    {product?.price}$
                  </p>
                </Flex>
              </Flex>
              <p className="absolute pt-0.5 pb-1 px-3 bg-primary text-white rounded-md top-3 left-3 lg:top-7 lg:left-7">
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
        <Swiper
          loop
          arrows
          autoplay
          spaceBetween={10}
          slidesPerView={isXl ? 5 : isSm ? 3 : 2}
        >
          {flashSales?.map(({ key, ...item }) => (
            <SwiperSlide key={key}>
              <ProductCard
                vertical
                size="sm"
                imgSrc={item?.img}
                onClick={() => handleSelectedProduct(item)}
                {...item}
              />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6 gap-2.5 md:gap-3 lg:gap-5 xl:gap-7">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {topProducts?.map(({ key, ...product }) => (
            <ProductCard
              key={key}
              imgSrc={product?.img}
              customClassNames={{
                img: 'shrink-0 w-32 sm:w-44 md:w-40 lg:w-52 2xl:w-56 3xl:w-64',
              }}
              onClick={() => handleSelectedProduct(product)}
              {...product}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'shop-by-gender',
      children: (
        <div className="rounded-md overflow-hidden">
          <Flex justify="space-between">
            {shopByGender.map((item, index) => {
              const isLeftBanner = !!(index % 2 == 0);

              const position = {
                leftBanner: {
                  title: 'right-5',
                  year: 'right-0',
                  button: 'bottom-2 left-2 sm:bottom-5 sm:left-5 lg:top-5',
                },
                rightBanner: {
                  title: 'left-4',
                  year: 'left-4',
                  button: 'bottom-2 right-2 sm:bottom-5 sm:right-5 lg:top-5',
                },
              };

              return (
                <Flex
                  key={index}
                  align="end"
                  justify="center"
                  className={classNames(
                    'relative group w-1/2',
                    index % 2 == 0 ? 'bg-gray-100' : 'bg-[#ece7e3]'
                  )}
                >
                  <Image
                    src={item?.img}
                    className="transition-all duration-200 ease-in-out group-has-hover:scale-105"
                  />
                  <Button
                    displayType="outlined"
                    title={item?.[isMd ? 'buttonTitle' : 'resButtonTitle']}
                    className={classNames(
                      'absolute text-xs sm:text-sm xl:text-xl 2xl:text-xl uppercase px-3! sm:px-5! xl:px-6! 2xl:px-8! py-2.5! sm:py-4! xl:py-5! 2xl:py-7! shadow-product hover:bg-primary! hover:text-white! hover:border-primary!',
                      position?.[isLeftBanner ? 'leftBanner' : 'rightBanner']
                        ?.button
                    )}
                  />
                  <p
                    className={classNames(
                      'absolute top-7 sm:top-10 uppercase leading-5 tracking-widest text-xs sm:text-sm lg:text-xl xl:text-2xl 3xl:text-3xl text-primary opacity-10 select-none',
                      position?.[isLeftBanner ? 'leftBanner' : 'rightBanner']
                        ?.title
                    )}
                  >
                    {item?.title}
                  </p>
                  <p
                    className={classNames(
                      'absolute top-10 sm:top-13 lg:top-16 tracking-widest font-bold text-7xl md:text-[100px] lg:text-9xl xl:text-[200px] 2xl:text-[240px] text-primary opacity-5 select-none',
                      position?.[isLeftBanner ? 'leftBanner' : 'rightBanner']
                        ?.year
                    )}
                  >
                    {item?.year}
                  </p>
                </Flex>
              );
            })}
          </Flex>
        </div>
      ),
    },
    {
      key: 'new-arrivals',
      title: 'Sản phẩm mới',
      children: (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-7 gap-y-8">
          {newArrivals?.map(({ key, ...product }) => (
            <ProductCard
              vertical
              key={key}
              effect="lift"
              imgSrc={product?.img}
              onClick={() => handleSelectedProduct(product)}
              {...product}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'casual',
      children: () => {
        const childElement = (item: Casual) => (
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
                className="absolute w-max bottom-5 right-1/2 max-lg:translate-x-1/2 lg:-bottom-10 lg:right-10 transition-all duration-300 ease-in-out lg:group-has-hover:bottom-10"
              />
            </div>
            <Flex vertical justify="center" align="center">
              <h4 className="font-bold capitalize text-center text-primary text-base md:text-base lg:text-xl 2xl:text-3xl xl:leading-10 mb-1.5 lg:mb-2.5 2xl:mb-3 3xl:mb-3.5">
                {item?.title}
              </h4>
              <p className="text-center text-body text-xs md:text-sm leading-6 md:leading-7 xl:px-10 3xl:px-20">
                {item?.subTitle}
              </p>
            </Flex>
          </Flex>
        );

        if (isLg)
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7">
              {casualItems.map((item) => childElement(item))}
            </div>
          );

        return (
          <Swiper
            loop
            arrows
            autoplay
            spaceBetween={15}
            slidesPerView={is2Xs ? 1 : 2}
          >
            {casualItems.map((item) => (
              <SwiperSlide>{childElement(item)}</SwiperSlide>
            ))}
          </Swiper>
        );
      },
    },
    // {
    //   key: 'subscription',
    //   children: (
    //     <Flex
    //       vertical
    //       align={isXl ? 'start' : 'center'}
    //       className="px-5! sm:px-8! md:px-16! 2xl:px-24! relative overflow-hidden sm:items-center xl:items-start rounded-lg bg-[#f9f9f9] py-10! md:py-14! lg:py-16!"
    //     >
    //       <div className="-mt-1.5 lg:-mt-2 xl:-mt-0.5 text-center ltr:xl:text-left rtl:xl:text-right mb-7 md:mb-8 lg:mb-9 xl:mb-0">
    //         <h3 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-heading mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5">
    //           Nhận lời khuyên của chuyên gia
    //         </h3>
    //         <p className="text-xs leading-6 text-body md:text-sm md:leading-7">
    //           Đăng ký nhận bản tin của chúng tôi và cập nhật thông tin mới nhất.
    //         </p>
    //       </div>
    //       <Form
    //         layout="inline"
    //         form={subscriptionForm}
    //         onFinish={(values) => console.log(values)}
    //         className="w-full shrink-0 sm:w-96 md:w-[545px] md:mt-7 z-10"
    //       >
    //         <FormItem className="w-full max-w-full md:max-w-[74%] mb-[2%]! md:mr-[2%]!">
    //           <Input className="h-11 md:h-12 min-h-12" />
    //         </FormItem>
    //         <Button
    //           title="Đăng ký"
    //           className="w-full max-w-full md:max-w-[24%] text-sm leading-4 px-5! md:px-6! lg:px-8! py-4! md:py-3.5! lg:py-4! mt-3! sm:mt-0! md:h-full"
    //           onClick={() => subscriptionForm.submit()}
    //         />
    //       </Form>
    //       <div
    //         style={{ backgroundImage: `url(${SUBSCRIPTION_BG})` }}
    //         className="hidden xl:block absolute w-full h-full right-0 top-0 bg-contain bg-right bg-no-repeat z-0"
    //       ></div>
    //     </Flex>
    //   ),
    // },
  ];

  const handleSelectedSize = (size: Size['size']) => {
    setSize({ size });
  };

  const handleSelectedColor = (color: string) => {
    setColor(color);
  };

  const handleSelectedProduct = (product: Product) => {
    setIsOpen(true);
    setSelectedProduct(product);
  };

  const handleDecrease = () => {
    setQuantity((prev) => prev - (prev === MIN_QUANTITY ? 0 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + (prev === MAX_QUANTITY ? 0 : 1));
  };

  return (
    <Layout className="bg-white!">
      <Carousel draggable autoplaySpeed={5000} autoplay={{ dotDuration: true }}>
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
        className="max-w-[1920px] mt-5 md:mt-8 gap-y-6! lg:gap-y-16! px-4! md:px-8! 2xl:px-16!"
      >
        {pageContents?.map(({ key, title, children }) => {
          const childElement = () =>
            typeof children === 'function' ? children() : children;

          if (title)
            return (
              <div key={key}>
                <h3 className="font-bold text-lg lg:text-3xl text-primary mb-4 lg:mb-8 capitalize">
                  {title}
                </h3>
                {childElement()}
              </div>
            );

          return childElement();
        })}
      </Space>

      <ProductModal
        open={isOpen}
        quantity={quantity}
        selectedColor={color}
        selectedSize={size?.size}
        product={selectedProduct}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
        onSelectSize={handleSelectedSize}
        onSelectColor={handleSelectedColor}
        onCancel={() => setIsOpen(false)}
      />
    </Layout>
  );
};

export default HomePage;
