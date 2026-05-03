export const translations = {
  fr: {
    // Nav
    nav_home: 'Accueil',
    nav_catalogue: 'Catalogue',
    nav_about: 'À propos',
    nav_contact: 'Contact',
    nav_cart: 'Panier',
    nav_search: 'Rechercher…',

    // Home
    hero_cta: 'Découvrir la collection',
    hero_badge: 'Créations d\'Exception',
    featured_title: 'Nos Meilleures Ventes',
    new_title: 'Nouveautés',
    categories_title: 'Explorez nos Collections',
    about_tagline: 'L\'art du parfum à votre portée',

    // Product
    add_to_cart: 'Ajouter au panier',
    out_of_stock: 'Rupture de stock',
    price: 'Prix',
    in_stock: 'En stock',
    qty: 'Quantité',
    notes_top: 'Notes de tête',
    notes_heart: 'Notes de cœur',
    notes_base: 'Notes de fond',
    concentration: 'Concentration',
    size: 'Contenance',
    gender: 'Genre',
    homme: 'Homme',
    femme: 'Femme',
    mixte: 'Mixte',

    // Cart
    cart_title: 'Mon Panier',
    cart_empty: 'Votre panier est vide',
    cart_continue: 'Continuer mes achats',
    cart_total: 'Total',
    cart_subtotal: 'Sous-total',
    cart_shipping: 'Livraison',
    cart_free_shipping: 'Livraison offerte',
    checkout: 'Commander',

    // Checkout
    checkout_title: 'Finaliser la commande',
    checkout_info: 'Informations de livraison',
    full_name: 'Nom complet',
    phone: 'Téléphone',
    email: 'Email (optionnel)',
    city: 'Ville',
    address: 'Adresse',
    zip: 'Code postal',
    delivery_notes: 'Instructions de livraison',
    payment_method: 'Paiement à la livraison',
    place_order: 'Passer la commande',
    order_summary: 'Récapitulatif',

    // Merci
    merci_title: 'Commande confirmée !',
    merci_text: 'Merci pour votre commande. Nous vous contacterons sous 24h pour confirmer la livraison.',
    merci_order_number: 'Numéro de commande',
    back_home: 'Retour à l\'accueil',

    // Footer
    footer_tagline: 'Des fragrances d\'exception, livrées chez vous.',
    footer_links: 'Liens utiles',
    footer_contact: 'Contact',
    footer_rights: 'Tous droits réservés',
    payment_cod: 'Paiement à la livraison',

    // Status
    status_pending: 'En attente',
    status_confirmed: 'Confirmée',
    status_processing: 'En préparation',
    status_shipped: 'Expédiée',
    status_delivered: 'Livrée',
    status_cancelled: 'Annulée',
    status_refunded: 'Remboursée',
  },
  ar: {
    // Nav
    nav_home: 'الرئيسية',
    nav_catalogue: 'الكتالوج',
    nav_about: 'من نحن',
    nav_contact: 'اتصل بنا',
    nav_cart: 'السلة',
    nav_search: 'ابحث…',

    // Home
    hero_cta: 'اكتشف المجموعة',
    hero_badge: 'إبداعات استثنائية',
    featured_title: 'الأكثر مبيعاً',
    new_title: 'وصل حديثاً',
    categories_title: 'استكشف مجموعاتنا',
    about_tagline: 'فن العطر في متناول يدك',

    // Product
    add_to_cart: 'أضف إلى السلة',
    out_of_stock: 'غير متوفر',
    price: 'السعر',
    in_stock: 'متوفر',
    qty: 'الكمية',
    notes_top: 'النوتات الأولية',
    notes_heart: 'النوتات القلبية',
    notes_base: 'النوتات الأساسية',
    concentration: 'التركيز',
    size: 'الحجم',
    gender: 'الجنس',
    homme: 'رجالي',
    femme: 'نسائي',
    mixte: 'مختلط',

    // Cart
    cart_title: 'سلتي',
    cart_empty: 'سلتك فارغة',
    cart_continue: 'مواصلة التسوق',
    cart_total: 'المجموع',
    cart_subtotal: 'المجموع الجزئي',
    cart_shipping: 'التوصيل',
    cart_free_shipping: 'توصيل مجاني',
    checkout: 'إتمام الطلب',

    // Checkout
    checkout_title: 'إتمام الطلب',
    checkout_info: 'معلومات التوصيل',
    full_name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني (اختياري)',
    city: 'المدينة',
    address: 'العنوان',
    zip: 'الرمز البريدي',
    delivery_notes: 'ملاحظات التوصيل',
    payment_method: 'الدفع عند الاستلام',
    place_order: 'تأكيد الطلب',
    order_summary: 'ملخص الطلب',

    // Merci
    merci_title: 'تم تأكيد طلبك!',
    merci_text: 'شكراً لطلبك. سنتواصل معك خلال 24 ساعة لتأكيد التوصيل.',
    merci_order_number: 'رقم الطلب',
    back_home: 'العودة للرئيسية',

    // Footer
    footer_tagline: 'عطور استثنائية تُوصَّل إلى بابك.',
    footer_links: 'روابط مفيدة',
    footer_contact: 'التواصل',
    footer_rights: 'جميع الحقوق محفوظة',
    payment_cod: 'الدفع عند الاستلام',

    // Status
    status_pending: 'قيد الانتظار',
    status_confirmed: 'مؤكد',
    status_processing: 'قيد التحضير',
    status_shipped: 'تم الشحن',
    status_delivered: 'تم التوصيل',
    status_cancelled: 'ملغى',
    status_refunded: 'مسترد',
  },
};

export type TranslationKey = keyof typeof translations.fr;
