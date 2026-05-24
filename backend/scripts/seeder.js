import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Article from '../models/Article.js';
import connectDB from '../config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Article.deleteMany();

    console.log('Existing DB collections wiped clean.');

    // 1. Seed Users (with hashed passwords handled by User.js pre-save hooks)
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
    });

    const clientUser = await User.create({
      username: 'client',
      email: 'client@gmail.com',
      password: 'client123',
      role: 'client',
    });

    console.log('Seeded Users: admin@gmail.com & client@gmail.com');

    // 2. Load and Seed Products from products.json
    const productsJsonPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

    for (const p of productsData) {
      await Product.create(p);
    }
    console.log(`Successfully seeded ${productsData.length} products dynamically from products.json`);

    // 3. Seed articles matching mockup layout
    const articlesData = [
      {
        title: 'Tinh dầu oải hương có tác dụng gì? Lợi ích và cách sử dụng',
        image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80',
        date: '15/03/2026',
        description: 'Tìm hiểu các tác dụng tuyệt vời của tinh dầu oải hương đối với sức khỏe, giấc ngủ và làn da của bạn, cùng cách sử dụng hiệu quả tại nhà.',
        content: 'Tinh dầu Oải Hương (Lavender) được mệnh danh là nữ hoàng của các loại tinh dầu nhờ hương thơm quyến rũ và hàng loạt tác dụng trị liệu tuyệt vời. Được chưng cất từ hoa oải hương, loại tinh dầu này không chỉ giúp bạn giảm bớt căng thẳng sau những giờ làm việc mệt mỏi mà còn là một trợ thủ đắc lực cải thiện chất lượng giấc ngủ. Bạn chỉ cần nhỏ 2-3 giọt vào máy khuếch tán trước khi ngủ 30 phút hoặc xoa lên gối để có một giấc ngủ say nồng. Ngoài ra, tinh dầu oải hương cũng có khả năng làm dịu vùng da bị viêm mụn, kháng khuẩn và hỗ trợ chữa lành vết côn trùng cắn vô cùng nhanh chóng.',
      },
      {
        title: 'Tinh dầu tràm trà – "Kháng sinh tự nhiên" cho sức khỏe và làn da',
        image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80',
        date: '10/06/2026',
        description: 'Tinh dầu tràm trà nổi tiếng với đặc tính kháng khuẩn, trị mụn và làm dịu da. Hãy cùng khám phá công dụng tuyệt vời của nó.',
        content: 'Tinh dầu Tràm Trà (Tea Tree) chiết xuất từ lá cây tràm trà Úc từ lâu đã nổi tiếng khắp thế giới nhờ đặc tính kháng khuẩn, kháng viêm và sát trùng vượt trội. Đây được xem như một liều thuốc kháng sinh tự nhiên cực kỳ an toàn cho da. Nếu bạn đang đau đầu với các nốt mụn viêm sưng, chỉ cần dùng tăm bông thấm trực tiếp tinh dầu tràm trà và chấm lên nốt mụn. Hoạt chất Terpinen-4-ol trong tinh dầu sẽ tiêu diệt vi khuẩn P.acnes gây mụn, giúp nhân mụn khô cồi nhanh chóng chỉ sau 1-2 ngày mà không để lại vết thâm sẹo.',
      },
      {
        title: '7 cách sử dụng tinh dầu giúp giảm căng thẳng, ngủ ngon hơn',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80',
        date: '05/08/2026',
        description: 'Hướng dẫn chi tiết các phương pháp khuếch tán, massage và xông hơi tinh dầu giúp xua tan mệt mỏi, tái tạo năng lượng hiệu quả.',
        content: 'Áp lực từ công việc và cuộc sống hiện đại dễ khiến chúng ta rơi vào trạng thái stress kéo dài và mất ngủ. Sử dụng liệu pháp hương thơm (Aromatherapy) là một giải pháp tự nhiên hiệu quả hàng đầu giúp cân bằng tâm trạng. Dưới đây là 7 cách đơn giản bạn có thể thực hiện tại nhà:\n1. Khuếch tán hương thơm bằng máy phun sương siêu âm.\n2. Tắm bồn thư giãn với vài giọt tinh dầu hòa cùng muối Epsom.\n3. Massage nhẹ nhàng vùng cổ vai gáy bằng tinh dầu pha với dầu nền (dầu dừa/dầu hạnh nhân).\n4. Xông mặt thải độc bằng hơi nước ấm.\n5. Nhỏ tinh dầu lên khăn giấy hoặc gối ngủ.\n6. Ngâm chân nước ấm cùng tinh dầu gừng hoặc sả chanh trước khi đi ngủ.\n7. Sử dụng xịt phòng tinh dầu tự chế để thanh lọc không gian sống.',
      },
      {
        title: 'Tinh dầu chanh – Bí quyết làm sạch và khử mùi tự nhiên',
        image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80',
        date: '01/09/2026',
        description: 'Tận dụng hương chanh tươi mát để thanh lọc không khí, khử mùi hôi khó chịu trong phòng ngủ và nhà bếp một cách an toàn nhất.',
        content: 'Tinh dầu Chanh (Lemon) mang trong mình hương thơm rực rỡ, tươi mát chứa hàm lượng lớn chất limonene – một chất chống oxy hóa mạnh mẽ có tác dụng diệt khuẩn và thanh lọc mạnh. Thay vì lạm dụng các loại hóa chất tẩy rửa công nghiệp độc hại, bạn có thể tự pha dung dịch xịt đa năng gồm nước ấm, giấm trắng và 15 giọt tinh dầu chanh để vệ sinh bếp, lau kính và khử mùi tủ lạnh. Không gian ngôi nhà sẽ ngập tràn hương thơm thảo mộc chanh sảng khoái và cực kỳ an toàn cho sức khỏe các thành viên trong gia đình.',
      }
    ];

    for (const a of articlesData) {
      await Article.create(a);
    }
    console.log('Seeded Articles dynamically to trigger pre-save hooks');

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
