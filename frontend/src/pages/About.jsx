import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/image';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);
  const { formatVND } = useContext(CartContext);

  const [newProducts, setNewProducts] = useState([]);
  const [newArticles, setNewArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [aboutConfig, setAboutConfig] = useState(() => {
    try {
      const raw = localStorage.getItem('aboutpage_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          brandStory: { ...parsed.brandStory },
          quoteBanner: { ...parsed.quoteBanner },
          coreValues: { ...parsed.coreValues },
          visionMission: { ...parsed.visionMission }
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      brandStory: {
        title: 'Giới thiệu',
        heading: 'Câu chuyện thương hiệu Essential Oil',
        paragraph1: 'Những năm gần đây liệu pháp hương thơm (Aromatherapy) sử dụng tinh dầu thiên nhiên phát triển vô cùng mạnh mẽ trên thế giới. Tuy nhiên, tại thị trường Việt Nam, các loại tinh dầu trôi nổi, kém chất lượng và pha chế hóa chất nhân tạo vẫn tràn lan, gây ảnh hưởng trực tiếp đến sức khỏe của người tiêu dùng.',
        paragraph2: 'Do nằm trong vùng khí hậu nhiệt đới ẩm gió mùa nên Việt Nam được mẹ thiên nhiên ưu ái ban tặng nguồn tài nguyên cây tinh dầu vô cùng phong phú và có dược tính sinh học hàng đầu (như sả chanh, bạc hà, tràm gió, quế...). Tuy nhiên, nguồn nguyên liệu quý giá này trước đây chủ yếu được xuất thô với giá trị thấp, trong khi người nông dân Việt Nam luôn gặp khó khăn trong việc tìm đầu ra ổn định cho nông sản của mình.',
        paragraph3: 'Chính vì lý do đó, chúng tôi luôn đau đáu mong muốn tạo ra một thương hiệu tinh dầu nguyên chất sử dụng nguồn thảo mộc sạch tại Việt Nam kết hợp các loài hoa cỏ nhập ngoại danh tiếng. Essential Oil ra đời với sứ mệnh đảm bảo nguồn tinh dầu nguyên chất 100% tinh khiết đến tay người tiêu dùng, đồng thời hỗ trợ bao tiêu sản phẩm và nâng cao giá trị chuỗi nông sản cho người nông dân Việt Nam.',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      },
      quoteBanner: {
        text: 'VÀ TỪ ĐÓ ESSENTIAL OIL ĐƯỢC RA ĐỜI!',
      },
      coreValues: {
        title: 'Giá trị cốt lõi E.S.O',
        items: [
          { letter: 'E', title: 'Eco-friendly', desc: 'Thân thiện môi trường – Phát triển vùng nguyên liệu hữu cơ, quy trình chiết xuất sạch, phát triển bền vững cùng nông nghiệp bản địa.' },
          { letter: 'S', title: 'Safe & Pure', desc: 'An toàn & Nguyên chất – Cam kết cung cấp tinh dầu thiên nhiên 100% nguyên chất tinh khiết, tuyệt đối không pha trộn hương liệu nhân tạo hay hóa chất độc hại.' },
          { letter: 'O', title: 'Organic', desc: 'Hữu cơ tự nhiên – Lựa chọn khắt khe các nguồn dược liệu tự nhiên đạt chuẩn, được chăm bón hữu cơ và thu hoạch thủ công tinh tế.' }
        ]
      },
      visionMission: {
        title: 'Tầm nhìn & Sứ mệnh',
        desc: 'Essential Oil định hướng trở thành thương hiệu tinh dầu thiên nhiên cao cấp hàng đầu Việt Nam. Chúng tôi không ngừng nghiên cứu các liệu pháp hương thơm sáng tạo, mang lại không gian sống an yên, thư thái và nâng niu sức khỏe toàn diện cho mọi gia đình Việt.',
      }
    };
  });

  const demoProducts = [
    { _id: 'dp1', name: 'Tinh dầu Oải Hương (Lavender)', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80', originalPrice: 275000, salePrice: 220000 },
    { _id: 'dp2', name: 'Tinh dầu Tràm Trà (Tea Tree)', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80', originalPrice: 225000, salePrice: 180000 },
    { _id: 'dp3', name: 'Tinh dầu Bạc Hà (Peppermint)', image: 'https://images.unsplash.com/photo-1595981267035-7b04ec82237e?auto=format&fit=crop&w=500&q=80', originalPrice: 200000, salePrice: 160000 },
    { _id: 'dp4', name: 'Tinh dầu Chanh (Lemon)', image: 'https://images.unsplash.com/photo-1536718497578-d01c07ae5f0d?auto=format&fit=crop&w=500&q=80', originalPrice: 190000, salePrice: 150000 },
    { _id: 'dp5', name: 'Tinh dầu Khuynh Diệp (Eucalyptus)', image: 'https://images.unsplash.com/photo-1608571424295-d14c274b126b?auto=format&fit=crop&w=500&q=80', originalPrice: 200000, salePrice: 160000 }
  ];

  const demoArticles = [
    { _id: 'da1', title: 'Tinh dầu oải hương có tác dụng gì? Lợi ích và cách sử dụng', image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80', date: '15/03/2026' },
    { _id: 'da2', title: 'Tinh dầu tràm trà – "Kháng sinh tự nhiên" cho làn da', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80', date: '10/06/2026' },
    { _id: 'da3', title: '7 cách sử dụng tinh dầu giúp giảm căng thẳng, ngủ ngon hơn', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80', date: '05/08/2026' }
  ];

  useEffect(() => {
    const loadSidebarData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const prodRes = await fetch(`${API_URL}/products`);
        const artRes = await fetch(`${API_URL}/articles`);
        
        let productsData = [];
        let articlesData = [];
        
        if (prodRes.ok) productsData = await prodRes.json();
        if (artRes.ok) articlesData = await artRes.json();
        
        setNewProducts(productsData.slice(0, 5));
        setNewArticles(articlesData.slice(0, 3));
      } catch {
        const localProd = localStorage.getItem('essential_local_products');
        const localArt = localStorage.getItem('essential_local_articles');
        setNewProducts(localProd ? JSON.parse(localProd).slice(0, 5) : demoProducts);
        setNewArticles(localArt ? JSON.parse(localArt).slice(0, 3) : demoArticles);
      } finally {
        setLoading(false);
      }
    };

    const fetchAboutConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/aboutpage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setAboutConfig(prev => ({
              ...prev,
              ...data,
              brandStory: { ...prev.brandStory, ...(data.brandStory || {}) },
              quoteBanner: { ...prev.quoteBanner, ...(data.quoteBanner || {}) },
              coreValues: {
                ...prev.coreValues,
                ...(data.coreValues || {}),
                items: (data.coreValues?.items || []).map((item, idx) => ({
                  ...prev.coreValues.items[idx],
                  ...item
                }))
              },
              visionMission: { ...prev.visionMission, ...(data.visionMission || {}) }
            }));
            localStorage.setItem('aboutpage_settings', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch About settings from database:', err);
      }
    };

    loadSidebarData();
    fetchAboutConfig();
  }, [API_URL]);

  return (
    <div className="about-page">
      <Header />

      {/* Breadcrumbs */}
      <div className="breadcrumb-section">
        <div className="container breadcrumbs">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{aboutConfig.brandStory.title}</span>
        </div>
      </div>

      <section className="about-content-section container">
        <div className="about-layout-grid">
          
          {/* Left Column: Brand Story */}
          <main className="about-brand-story glass">
            <h1 className="about-title">{aboutConfig.brandStory.title}</h1>
            
            <article className="story-article">
              <h2 className="story-heading">{aboutConfig.brandStory.heading}</h2>
              
              <p className="story-paragraph">
                {aboutConfig.brandStory.paragraph1}
              </p>

              {aboutConfig.brandStory.image && (
                <div className="story-img-banner glass">
                  <img src={getImageUrl(aboutConfig.brandStory.image)} alt="Cây cỏ thảo mộc nguyên chất" />
                </div>
              )}

              <p className="story-paragraph">
                {aboutConfig.brandStory.paragraph2}
              </p>

              <p className="story-paragraph">
                {aboutConfig.brandStory.paragraph3}
              </p>

              {aboutConfig.quoteBanner.text && (
                <div className="quote-banner">
                  <span className="quote-icon">“</span>
                  {aboutConfig.quoteBanner.text}
                </div>
              )}

              <h2 className="story-heading" style={{ marginTop: '2.5rem' }}>{aboutConfig.coreValues.title}</h2>
              <p className="story-paragraph">
                Chúng tôi vận hành và cam kết chất lượng sản phẩm dựa trên 3 giá trị cốt lõi bền vững:
              </p>

              <ul className="meaning-list">
                {aboutConfig.coreValues.items.map((item, idx) => (
                  <li key={idx}>
                    <strong className="meaning-letter">{item.letter}</strong>: <strong>{item.title}</strong> – {item.desc.split(' – ')[1] || item.desc}
                  </li>
                ))}
              </ul>

              <h2 className="story-heading" style={{ marginTop: '2.5rem' }}>{aboutConfig.visionMission.title}</h2>
              <p className="story-paragraph">
                {aboutConfig.visionMission.desc}
              </p>
            </article>
          </main>

          {/* Right Column: Sidebar (New Products & Articles) */}
          <aside className="about-sidebar">
            
            {/* New Products Widget */}
            <div className="sidebar-widget glass">
              <h3 className="widget-title">SẢN PHẨM MỚI</h3>
              <div className="sidebar-products-list">
                {newProducts.map(p => (
                  <div className="sidebar-product-item" key={p._id} onClick={() => navigate(`/product/${p._id}`)}>
                    <div className="item-img-box">
                      <img src={getImageUrl(p.image)} alt={p.name} />
                    </div>
                    <div className="item-info-box">
                      <h4 className="item-title">{p.name}</h4>
                      <span className="item-price">{formatVND(p.salePrice)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Articles Widget */}
            <div className="sidebar-widget glass">
              <h3 className="widget-title">BÀI VIẾT MỚI</h3>
              <div className="sidebar-articles-list">
                {newArticles.map(a => (
                  <div className="sidebar-article-item" key={a._id} onClick={() => navigate(`/article/${a._id}`)}>
                    <div className="item-img-box">
                      <img src={getImageUrl(a.image)} alt={a.title} />
                    </div>
                    <div className="item-info-box">
                      <h4 className="item-title">{a.title}</h4>
                      <span className="item-date">📅 {a.date || '15/03/2026'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
