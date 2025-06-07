export interface CoreMember {
  name: string;
  role: string;
  description: string;
  image?: string | null;
}

export interface MemberGeneration {
  title: string;
  members: CoreMember[];
}

export interface ImageErrorState {
  [key: string]: boolean;
}

export type CoreMembersData = MemberGeneration[];

export const coreMembersData: CoreMembersData = [
  {
    title: "Gen 5 - Current Generation",
    members: [
      {
        name: "Nguyễn Kim Bảo Nguyên",
        role: "President",
        description: "Current Fcoder's Generation 5 President",
        image: "/images/members/nguyen-kim-bao-nguyen.jpg",
      },
      {
        name: "Lê Nhựt Anh",
        role: "Head of Academics",
        description:
          "Head of Academics - Golden Frog of Engineering Department Spring 2024",
        image: "/images/members/le-nhut-anh.jpg",
      },
      {
        name: "Trương Đoàn Minh Phúc",
        role: "Head of Human Resources",
        description: "Head of Human Resources",
        image: "/images/members/truong-doan-minh-phuc.jpg",
      },
      {
        name: "Châu Tấn Cường",
        role: "Head of Events",
        description: "Head of Events",
        image: "/images/members/chau-tan-cuong.jpg",
      },
      {
        name: "Nguyễn Quang Huy",
        role: "Head of Communications",
        description: "Head of Communications",
        image: "/images/members/nguyen-quang-huy.jpg",
      },
    ],
  },
  {
    title: "Gen 4 - Previous Generation",
    members: [
      {
        name: "Trần Đại Nhân",
        role: "President",
        description: "Former President of Generation 4",
        image: "/images/members/tran-dai-nhan.jpg",
      },
      {
        name: "Nguyễn Lê Ngọc Minh",
        role: "Vice President of External Affairs",
        description: "Vice President of External Affairs",
        image: "/images/members/nguyen-le-ngoc-minh.jpg",
      },
      {
        name: "Nguyễn Hoàng Đạt",
        role: "Vice President of Internal Affairs",
        description: "Vice President of Internal Affairs",
        image: "/images/members/nguyen-hoang-dat.jpg",
      },
      {
        name: "Lê Thịnh",
        role: "Secretary",
        description: "Secretary of Generation 4",
        image: "/images/members/le-thinh.jpg",
      },
      {
        name: "Phan Văn Hòa Thuận",
        role: "Vice President of Internal Affairs",
        description: "Vice President of Internal Affairs & Former Treasurer",
        image: "/images/members/phan-van-hoa-thuan.jpg",
      },
      {
        name: "Bạch Công Chính",
        role: "Treasurer",
        description: "Treasurer of Generation 4.1",
        image: "/images/members/bach-cong-chinh.jpg",
      },
    ],
  },
  {
    title: "Gen 3 - Legacy Generation",
    members: [
      {
        name: "Nguyễn Vũ Như Huỳnh",
        role: "President",
        description: "Former President of Generation 3",
        image: "/images/members/nguyen-vu-nhu-huynh.jpg",
      },
      {
        name: "Nguyễn Hoàng Khang",
        role: "Vice President",
        description: "Former Vice President of Generation 3",
        image: "/images/members/nguyen-hoang-khang.jpg",
      },
      {
        name: "Võ Hoàng Phúc",
        role: "Vice President",
        description:
          "Former Vice President - Left the Club - Former F-SEC Executive",
        image: "/images/members/vo-hoang-phuc.jpg",
      },
      {
        name: "Phan Hồng Phúc",
        role: "Vice President",
        description: "Former Vice President - Golden Frog",
        image: "/images/members/phan-hong-phuc.jpg",
      },
      {
        name: "Nguyễn Thị Trà My",
        role: "Treasurer",
        description: "Former Treasurer of Generation 3",
        image: "/images/members/nguyen-thi-tra-my.jpg",
      },
      {
        name: "Nguyễn Thị Diễm Hương",
        role: "Secretary",
        description: "Former Secretary of Generation 3",
        image: "/images/members/nguyen-thi-diem-huong.jpg",
      },
      {
        name: "Huỳnh Gia Phát",
        role: "Communications Manager",
        description: "Former Communications Manager",
        image: "/images/members/huynh-gia-phat.jpg",
      },
      {
        name: "Hứa Khánh Huy",
        role: "Secretary",
        description: "Former Secretary of Generation 3",
        image: "/images/members/hua-khanh-huy.jpg",
      },
    ],
  },
  {
    title: "Gen 2 - Founding Generation",
    members: [
      {
        name: "Võ Ngọc Thiên",
        role: "President",
        description: "Former President of Generation 2",
        image: "/images/members/vo-ngoc-thien.jpg",
      },
      {
        name: "Phạm Trường Phú",
        role: "Vice President",
        description: "Former Vice President - Left the Club",
        image: "/images/members/pham-truong-phu.jpg",
      },
      {
        name: "Nguyễn Quỳnh Anh",
        role: "Vice President",
        description: "Former Vice President - Left the Club - Golden Frog",
        image: "/images/members/nguyen-quynh-anh.jpg",
      },
      {
        name: "Trần Văn Hảo",
        role: "Treasurer",
        description: "Former Treasurer of Generation 2",
        image: "/images/members/tran-van-hao.jpg",
      },
      {
        name: "Đặng Minh Cảnh",
        role: "Secretary",
        description: "Former Secretary - Golden Frog",
        image: "/images/members/dang-minh-canh.jpg",
      },
      {
        name: "Nguyễn Ngọc Mỹ Quyên",
        role: "Treasurer",
        description: "Former Treasurer of Generation 2",
        image: "/images/members/nguyen-ngoc-my-quyen.jpg",
      },
    ],
  },
  {
    title: "Gen 1 - Founder",
    members: [
      {
        name: "Tấn Phát",
        role: "President",
        description: "Founder and First President of F-Coder Club",
        image: "/images/members/tan-phat.jpg",
      },
    ],
  },
];
