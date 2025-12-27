import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, QuantityType, CustomizationType, SimpleCustomizationType, TaxType, NodeType, EdgeType } from '@prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting comprehensive seed with 28 items...');

  // ============================================================================
  // CLEANUP OLD DATA
  // ============================================================================
//   console.log('🧹 Cleaning existing data...');
  
//   await prisma.orderItemCustomization.deleteMany();
//   await prisma.orderItem.deleteMany();
//   await prisma.orderTax.deleteMany();
//   await prisma.orderStatusHistory.deleteMany();
//   await prisma.payment.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.customizationEdge.deleteMany();
//   await prisma.customizationNode.deleteMany();
//   await prisma.menuItemCustomization.deleteMany();
//   await prisma.customization.deleteMany();
//   await prisma.menuItemTax.deleteMany();
//   await prisma.tax.deleteMany();
//   await prisma.menuItem.deleteMany();
//   await prisma.category.deleteMany();

//   console.log('✅ Cleaned old data');

  // ============================================================================
  // TAXES
  // ============================================================================
  console.log('💰 Creating taxes...');
  
  const salesTax = await prisma.tax.create({
    data: {
      name: 'Sales Tax',
      type: TaxType.PERCENTAGE,
      value: 18.0,
      isInclusive: false,
      displayOrder: 1,
    },
  });

  const serviceCharge = await prisma.tax.create({
    data: {
      name: 'Service Charge',
      type: TaxType.FIXED,
      value: 2.50,
      isInclusive: false,
      displayOrder: 2,
    },
  });

  console.log('✅ Created 2 taxes');

  // ============================================================================
  // CATEGORIES
  // ============================================================================
  console.log('📁 Creating categories...');

  const appetizers = await prisma.category.create({
    data: {
      name: 'Appetizers',
      slug: 'appetizers',
      description: 'Start your meal with our delicious starters',
      displayOrder: 1,
    },
  });

  const mainCourse = await prisma.category.create({
    data: {
      name: 'Main Course',
      slug: 'main-course',
      description: 'Our signature main dishes',
      displayOrder: 2,
    },
  });

  const italian = await prisma.category.create({
    data: {
      name: 'Italian',
      slug: 'italian',
      description: 'Authentic Italian cuisine',
      parentCategoryId: mainCourse.id,
      displayOrder: 1,
    },
  });

  const indian = await prisma.category.create({
    data: {
      name: 'Indian',
      slug: 'indian',
      description: 'Flavorful Indian dishes',
      parentCategoryId: mainCourse.id,
      displayOrder: 2,
    },
  });

  const chinese = await prisma.category.create({
    data: {
      name: 'Chinese',
      slug: 'chinese',
      description: 'Traditional Chinese favorites',
      parentCategoryId: mainCourse.id,
      displayOrder: 3,
    },
  });

  const desserts = await prisma.category.create({
    data: {
      name: 'Desserts',
      slug: 'desserts',
      description: 'Sweet treats to end your meal',
      displayOrder: 3,
    },
  });

  const beverages = await prisma.category.create({
    data: {
      name: 'Beverages',
      slug: 'beverages',
      description: 'Refreshing drinks',
      displayOrder: 4,
    },
  });

  console.log('✅ Created 7 categories');

  // ============================================================================
  // SIMPLE CUSTOMIZATIONS
  // ============================================================================
  console.log('🔧 Creating simple customizations...');

  // Sizes
  const sizeSmall = await prisma.customization.create({
    data: { name: 'Small', type: SimpleCustomizationType.SIZE, price: 0 },
  });
  const sizeMedium = await prisma.customization.create({
    data: { name: 'Medium', type: SimpleCustomizationType.SIZE, price: 1.50 },
  });
  const sizeLarge = await prisma.customization.create({
    data: { name: 'Large', type: SimpleCustomizationType.SIZE, price: 3.00 },
  });

  // Pizza toppings
  const extraCheese = await prisma.customization.create({
    data: { name: 'Extra Cheese', type: SimpleCustomizationType.ADDON, price: 2.00 },
  });
  const mushrooms = await prisma.customization.create({
    data: { name: 'Mushrooms', type: SimpleCustomizationType.ADDON, price: 1.50 },
  });
  const olives = await prisma.customization.create({
    data: { name: 'Olives', type: SimpleCustomizationType.ADDON, price: 1.50 },
  });
  const bellPeppers = await prisma.customization.create({
    data: { name: 'Bell Peppers', type: SimpleCustomizationType.ADDON, price: 1.00 },
  });

  // Spice levels
  const mild = await prisma.customization.create({
    data: { name: 'Mild', type: SimpleCustomizationType.MODIFIER, price: 0 },
  });
  const medium = await prisma.customization.create({
    data: { name: 'Medium Spicy', type: SimpleCustomizationType.MODIFIER, price: 0 },
  });
  const spicy = await prisma.customization.create({
    data: { name: 'Spicy', type: SimpleCustomizationType.MODIFIER, price: 0 },
  });
  const extraSpicy = await prisma.customization.create({
    data: { name: 'Extra Spicy', type: SimpleCustomizationType.MODIFIER, price: 0 },
  });

  // Coffee add-ons
  const extraShot = await prisma.customization.create({
    data: { name: 'Extra Shot', type: SimpleCustomizationType.ADDON, price: 1.00 },
  });
  const vanillaSyrup = await prisma.customization.create({
    data: { name: 'Vanilla Syrup', type: SimpleCustomizationType.ADDON, price: 0.50 },
  });
  const caramelSyrup = await prisma.customization.create({
    data: { name: 'Caramel Syrup', type: SimpleCustomizationType.ADDON, price: 0.50 },
  });

  // Milk options
  const oatMilk = await prisma.customization.create({
    data: { name: 'Oat Milk', type: SimpleCustomizationType.OPTION, price: 0.50 },
  });
  const almondMilk = await prisma.customization.create({
    data: { name: 'Almond Milk', type: SimpleCustomizationType.OPTION, price: 0.50 },
  });

  console.log('✅ Created 16 simple customizations');

  // ============================================================================
  // APPETIZERS
  // ============================================================================
  console.log('🍞 Creating appetizers...');

  await prisma.menuItem.create({
    data: {
      categoryId: appetizers.id,
      name: 'Garlic Bread',
      slug: 'garlic-bread',
      description: 'Crispy bread with garlic butter and herbs',
      imageUrl: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400',
      basePrice: 5.99,
      quantityType: QuantityType.UNIT,
      unit: 'piece',
      prepTime: 10,
      dietaryTags: ['vegetarian'],
      allergens: ['gluten', 'dairy'],
      customizationType: CustomizationType.SIMPLE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
      customizations: {
        create: [
          { customizationId: sizeSmall.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 1 },
          { customizationId: sizeMedium.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 2 },
          { customizationId: sizeLarge.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 3 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: appetizers.id,
      name: 'Chicken Wings',
      slug: 'chicken-wings',
      description: 'Crispy fried chicken wings with your choice of sauce',
      imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
      basePrice: 12.99,
      quantityType: QuantityType.WEIGHT,
      unit: 'kg',
      minQuantity: 0.25,
      maxQuantity: 2.0,
      stepQuantity: 0.25,
      prepTime: 20,
      allergens: ['gluten'],
      customizationType: CustomizationType.SIMPLE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
      customizations: {
        create: [
          { customizationId: mild.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 1 },
          { customizationId: medium.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 2 },
          { customizationId: spicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 3 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: appetizers.id,
      name: 'Spring Rolls',
      slug: 'spring-rolls',
      description: 'Crispy vegetable spring rolls served with sweet chili sauce',
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
      basePrice: 6.99,
      quantityType: QuantityType.UNIT,
      unit: 'piece',
      minQuantity: 2,
      stepQuantity: 2,
      prepTime: 15,
      dietaryTags: ['vegetarian', 'vegan'],
      allergens: ['gluten'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: appetizers.id,
      name: 'Bruschetta',
      slug: 'bruschetta',
      description: 'Toasted bread topped with fresh tomatoes, basil, and olive oil',
      imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
      basePrice: 7.99,
      quantityType: QuantityType.UNIT,
      unit: 'piece',
      prepTime: 10,
      dietaryTags: ['vegetarian'],
      allergens: ['gluten'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  console.log('✅ Created 4 appetizers');

  // ============================================================================
  // ITALIAN
  // ============================================================================
  console.log('🍕 Creating Italian dishes...');

  await prisma.menuItem.create({
    data: {
      categoryId: italian.id,
      name: 'Margherita Pizza',
      slug: 'margherita-pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      basePrice: 12.99,
      quantityType: QuantityType.UNIT,
      unit: 'pizza',
      prepTime: 25,
      dietaryTags: ['vegetarian'],
      allergens: ['gluten', 'dairy'],
      customizationType: CustomizationType.SIMPLE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
      customizations: {
        create: [
          { customizationId: sizeSmall.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 1 },
          { customizationId: sizeMedium.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 2 },
          { customizationId: sizeLarge.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 3 },
          { customizationId: extraCheese.id, isRequired: false, minSelections: 0, maxSelections: 5, displayOrder: 4 },
          { customizationId: mushrooms.id, isRequired: false, minSelections: 0, maxSelections: 5, displayOrder: 5 },
          { customizationId: olives.id, isRequired: false, minSelections: 0, maxSelections: 5, displayOrder: 6 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: italian.id,
      name: 'Pepperoni Pizza',
      slug: 'pepperoni-pizza',
      description: 'Classic pizza topped with pepperoni and mozzarella cheese',
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      basePrice: 14.99,
      quantityType: QuantityType.UNIT,
      unit: 'pizza',
      prepTime: 25,
      allergens: ['gluten', 'dairy'],
      customizationType: CustomizationType.SIMPLE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
      customizations: {
        create: [
          { customizationId: sizeSmall.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 1 },
          { customizationId: sizeMedium.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 2 },
          { customizationId: sizeLarge.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 3 },
          { customizationId: extraCheese.id, isRequired: false, minSelections: 0, maxSelections: 5, displayOrder: 4 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: italian.id,
      name: 'Spaghetti Carbonara',
      slug: 'spaghetti-carbonara',
      description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
      basePrice: 13.99,
      quantityType: QuantityType.SERVING,
      unit: 'plate',
      prepTime: 20,
      allergens: ['gluten', 'dairy', 'eggs'],
      customizationType: CustomizationType.NONE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: italian.id,
      name: 'Fettuccine Alfredo',
      slug: 'fettuccine-alfredo',
      description: 'Rich and creamy fettuccine pasta with parmesan sauce',
      imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
      basePrice: 12.99,
      quantityType: QuantityType.SERVING,
      unit: 'plate',
      prepTime: 18,
      dietaryTags: ['vegetarian'],
      allergens: ['gluten', 'dairy'],
      customizationType: CustomizationType.NONE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: italian.id,
      name: 'Lasagna',
      slug: 'lasagna',
      description: 'Layers of pasta with meat sauce, ricotta, and mozzarella',
      imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
      basePrice: 15.99,
      quantityType: QuantityType.UNIT,
      unit: 'portion',
      prepTime: 30,
      allergens: ['gluten', 'dairy', 'eggs'],
      customizationType: CustomizationType.NONE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
    },
  });

  console.log('✅ Created 5 Italian dishes');

  // ============================================================================
  // INDIAN
  // ============================================================================
  console.log('🍛 Creating Indian dishes...');

  await prisma.menuItem.create({
    data: {
      categoryId: indian.id,
      name: 'Butter Chicken',
      slug: 'butter-chicken',
      description: 'Tender chicken in a rich tomato and cream sauce',
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      basePrice: 14.99,
      quantityType: QuantityType.SERVING,
      unit: 'bowl',
      prepTime: 25,
      allergens: ['dairy'],
      customizationType: CustomizationType.SIMPLE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
      customizations: {
        create: [
          { customizationId: mild.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 1 },
          { customizationId: medium.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 2 },
          { customizationId: spicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 3 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: indian.id,
      name: 'Paneer Tikka',
      slug: 'paneer-tikka',
      description: 'Grilled cottage cheese marinated in spices',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
      basePrice: 11.99,
      quantityType: QuantityType.WEIGHT,
      unit: 'kg',
      minQuantity: 0.25,
      maxQuantity: 1.5,
      stepQuantity: 0.25,
      prepTime: 20,
      dietaryTags: ['vegetarian'],
      allergens: ['dairy'],
      customizationType: CustomizationType.SIMPLE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
      customizations: {
        create: [
          { customizationId: mild.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 1 },
          { customizationId: medium.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 2 },
          { customizationId: spicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 3 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: indian.id,
      name: 'Chicken Biryani',
      slug: 'chicken-biryani',
      description: 'Fragrant basmati rice with spiced chicken',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      basePrice: 15.99,
      quantityType: QuantityType.SERVING,
      unit: 'plate',
      prepTime: 35,
      customizationType: CustomizationType.SIMPLE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
      customizations: {
        create: [
          { customizationId: mild.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 1 },
          { customizationId: medium.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 2 },
          { customizationId: spicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 3 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: indian.id,
      name: 'Dal Makhani',
      slug: 'dal-makhani',
      description: 'Creamy black lentils simmered with spices',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      basePrice: 9.99,
      quantityType: QuantityType.SERVING,
      unit: 'bowl',
      prepTime: 20,
      dietaryTags: ['vegetarian'],
      allergens: ['dairy'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: indian.id,
      name: 'Tandoori Chicken',
      slug: 'tandoori-chicken',
      description: 'Clay oven roasted chicken marinated in yogurt and spices',
      imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
      basePrice: 16.99,
      quantityType: QuantityType.WEIGHT,
      unit: 'kg',
      minQuantity: 0.5,
      maxQuantity: 2.0,
      stepQuantity: 0.5,
      prepTime: 30,
      allergens: ['dairy'],
      customizationType: CustomizationType.SIMPLE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
      customizations: {
        create: [
          { customizationId: mild.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 1 },
          { customizationId: medium.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 2 },
          { customizationId: spicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 3 },
          { customizationId: extraSpicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 4 },
        ],
      },
    },
  });

  console.log('✅ Created 5 Indian dishes');

  // ============================================================================
  // CHINESE
  // ============================================================================
  console.log('🥡 Creating Chinese dishes...');

  await prisma.menuItem.create({
    data: {
      categoryId: chinese.id,
      name: 'Fried Rice',
      slug: 'fried-rice',
      description: 'Wok-fried rice with vegetables and your choice of protein',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      basePrice: 10.99,
      quantityType: QuantityType.SERVING,
      unit: 'plate',
      prepTime: 15,
      allergens: ['eggs'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: chinese.id,
      name: 'Hakka Noodles',
      slug: 'hakka-noodles',
      description: 'Stir-fried noodles with vegetables in Indo-Chinese style',
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
      basePrice: 11.99,
      quantityType: QuantityType.SERVING,
      unit: 'plate',
      prepTime: 15,
      allergens: ['gluten'],
      customizationType: CustomizationType.SIMPLE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
      customizations: {
        create: [
          { customizationId: mild.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 1 },
          { customizationId: medium.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 2 },
          { customizationId: spicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 3 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: chinese.id,
      name: 'Sweet & Sour Chicken',
      slug: 'sweet-sour-chicken',
      description: 'Crispy chicken in tangy sweet and sour sauce',
      imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
      basePrice: 13.99,
      quantityType: QuantityType.SERVING,
      unit: 'plate',
      prepTime: 20,
      allergens: ['gluten'],
      customizationType: CustomizationType.NONE,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: chinese.id,
      name: 'Manchurian',
      slug: 'manchurian',
      description: 'Deep-fried balls in spicy Indo-Chinese sauce',
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
      basePrice: 11.99,
      quantityType: QuantityType.SERVING,
      unit: 'bowl',
      prepTime: 18,
      allergens: ['gluten'],
      customizationType: CustomizationType.SIMPLE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
      customizations: {
        create: [
          { customizationId: mild.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 1 },
          { customizationId: medium.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 2 },
          { customizationId: spicy.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 3 },
        ],
      },
    },
  });

  console.log('✅ Created 4 Chinese dishes');

  // ============================================================================
  // DESSERTS
  // ============================================================================
  console.log('🍰 Creating desserts...');

  await prisma.menuItem.create({
    data: {
      categoryId: desserts.id,
      name: 'Tiramisu',
      slug: 'tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      basePrice: 6.99,
      quantityType: QuantityType.UNIT,
      unit: 'slice',
      prepTime: 5,
      dietaryTags: ['vegetarian'],
      allergens: ['dairy', 'eggs', 'gluten'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: desserts.id,
      name: 'Chocolate Brownie',
      slug: 'chocolate-brownie',
      description: 'Warm chocolate brownie with a gooey center',
      imageUrl: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400',
      basePrice: 5.99,
      quantityType: QuantityType.UNIT,
      unit: 'piece',
      prepTime: 10,
      dietaryTags: ['vegetarian'],
      allergens: ['dairy', 'eggs', 'gluten'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: desserts.id,
      name: 'Ice Cream',
      slug: 'ice-cream',
      description: 'Premium ice cream in various flavors',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      basePrice: 4.99,
      quantityType: QuantityType.SERVING,
      unit: 'scoop',
      minQuantity: 1,
      maxQuantity: 5,
      stepQuantity: 1,
      prepTime: 3,
      dietaryTags: ['vegetarian'],
      allergens: ['dairy'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: desserts.id,
      name: 'Cheesecake',
      slug: 'cheesecake',
      description: 'Creamy New York style cheesecake',
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4c7fd4e6cfd?w=400',
      basePrice: 6.99,
      quantityType: QuantityType.UNIT,
      unit: 'slice',
      prepTime: 5,
      dietaryTags: ['vegetarian'],
      allergens: ['dairy', 'eggs', 'gluten'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  console.log('✅ Created 4 desserts');

  // ============================================================================
  // BEVERAGES
  // ============================================================================
  console.log('☕ Creating beverages...');

  await prisma.menuItem.create({
    data: {
      categoryId: beverages.id,
      name: 'Coffee',
      slug: 'coffee',
      description: 'Premium roasted coffee',
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
      basePrice: 3.50,
      quantityType: QuantityType.SERVING,
      unit: 'cup',
      prepTime: 5,
      customizationType: CustomizationType.SIMPLE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
      customizations: {
        create: [
          { customizationId: sizeSmall.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 1 },
          { customizationId: sizeMedium.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 2 },
          { customizationId: sizeLarge.id, isRequired: true, minSelections: 1, maxSelections: 1, displayOrder: 3 },
          { customizationId: extraShot.id, isRequired: false, minSelections: 0, maxSelections: 3, displayOrder: 4 },
          { customizationId: vanillaSyrup.id, isRequired: false, minSelections: 0, maxSelections: 2, displayOrder: 5 },
          { customizationId: caramelSyrup.id, isRequired: false, minSelections: 0, maxSelections: 2, displayOrder: 6 },
          { customizationId: oatMilk.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 7 },
          { customizationId: almondMilk.id, isRequired: false, minSelections: 0, maxSelections: 1, displayOrder: 8 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: beverages.id,
      name: 'Fresh Orange Juice',
      slug: 'fresh-orange-juice',
      description: 'Freshly squeezed orange juice',
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      basePrice: 4.99,
      quantityType: QuantityType.VOLUME,
      unit: 'ml',
      minQuantity: 200,
      maxQuantity: 500,
      stepQuantity: 100,
      prepTime: 5,
      dietaryTags: ['vegan', 'gluten-free'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: beverages.id,
      name: 'Coca Cola',
      slug: 'coca-cola',
      description: 'Classic Coca Cola',
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
      basePrice: 2.50,
      quantityType: QuantityType.UNIT,
      unit: 'can',
      prepTime: 2,
      dietaryTags: ['vegan'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: beverages.id,
      name: 'Mango Smoothie',
      slug: 'mango-smoothie',
      description: 'Creamy mango smoothie with yogurt',
      imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
      basePrice: 5.99,
      quantityType: QuantityType.VOLUME,
      unit: 'ml',
      minQuantity: 300,
      maxQuantity: 500,
      stepQuantity: 100,
      prepTime: 7,
      dietaryTags: ['vegetarian'],
      allergens: ['dairy'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: beverages.id,
      name: 'Iced Tea',
      slug: 'iced-tea',
      description: 'Refreshing iced tea',
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
      basePrice: 3.99,
      quantityType: QuantityType.SERVING,
      unit: 'glass',
      prepTime: 3,
      dietaryTags: ['vegan', 'gluten-free'],
      customizationType: CustomizationType.NONE,
      taxes: { create: [{ taxId: salesTax.id, applyOrder: 1 }] },
    },
  });

  console.log('✅ Created 5 beverages');

  // ============================================================================
  // BUILD YOUR OWN BOWL (DAG)
  // ============================================================================
  console.log('🥗 Creating Build Your Own Bowl (DAG)...');

  const bowl = await prisma.menuItem.create({
    data: {
      categoryId: mainCourse.id,
      name: 'Build Your Own Bowl',
      slug: 'build-your-own-bowl',
      description: 'Create your perfect bowl with your choice of base, protein, vegetables, and sauce',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      basePrice: 9.99,
      quantityType: QuantityType.SERVING,
      unit: 'bowl',
      prepTime: 20,
      customizationType: CustomizationType.COMPLEX_DAG,
      taxes: {
        create: [
          { taxId: salesTax.id, applyOrder: 1 },
          { taxId: serviceCharge.id, applyOrder: 2 },
        ],
      },
    },
  });

  // Base group
  const baseGroup = await prisma.customizationNode.create({
    data: {
      menuItemId: bowl.id,
      type: NodeType.GROUP,
      name: 'Choose Your Base',
      description: 'Select one base option',
      price: 0,
      displayOrder: 1,
    },
  });

  const rice = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'White Rice', price: 0, displayOrder: 1 },
  });

  const quinoa = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Quinoa', price: 2, displayOrder: 2 },
  });

  const greens = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Mixed Greens', price: 1, displayOrder: 3 },
  });

  // Protein group
  const proteinGroup = await prisma.customizationNode.create({
    data: {
      menuItemId: bowl.id,
      type: NodeType.GROUP,
      name: 'Choose Protein(s)',
      description: 'Select 1-2 proteins',
      price: 0,
      displayOrder: 2,
    },
  });

  const chicken = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Grilled Chicken', price: 3, displayOrder: 1 },
  });

  const tofu = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Tofu', price: 2, displayOrder: 2 },
  });

  const beef = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Beef', price: 4.50, displayOrder: 3 },
  });

  // Veggie group
  const veggieGroup = await prisma.customizationNode.create({
    data: {
      menuItemId: bowl.id,
      type: NodeType.GROUP,
      name: 'Add Vegetables',
      description: 'Choose up to 5 vegetables',
      price: 0,
      displayOrder: 3,
    },
  });

  const broccoli = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Broccoli', price: 0.50, displayOrder: 1 },
  });

  const edamame = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Edamame', price: 1, displayOrder: 2 },
  });

  const avocado = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Avocado', price: 1.50, displayOrder: 3 },
  });

  // Sauce group
  const sauceGroup = await prisma.customizationNode.create({
    data: {
      menuItemId: bowl.id,
      type: NodeType.GROUP,
      name: 'Choose Sauce',
      description: 'Select one sauce',
      price: 0,
      displayOrder: 4,
    },
  });

  const teriyaki = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Teriyaki', price: 0, displayOrder: 1 },
  });

  const peanut = await prisma.customizationNode.create({
    data: { menuItemId: bowl.id, type: NodeType.OPTION, name: 'Peanut Sauce', price: 0.50, displayOrder: 2 },
  });

  // Create edges
  await prisma.customizationEdge.createMany({
    data: [
      { parentNodeId: baseGroup.id, childNodeId: rice.id, edgeType: EdgeType.HAS_OPTION, constraints: { min: 1, max: 1, required: true }, displayOrder: 1 },
      { parentNodeId: baseGroup.id, childNodeId: quinoa.id, edgeType: EdgeType.HAS_OPTION, displayOrder: 2 },
      { parentNodeId: baseGroup.id, childNodeId: greens.id, edgeType: EdgeType.HAS_OPTION, displayOrder: 3 },
      { parentNodeId: proteinGroup.id, childNodeId: chicken.id, edgeType: EdgeType.HAS_OPTION, constraints: { min: 1, max: 2, required: true }, displayOrder: 1 },
      { parentNodeId: proteinGroup.id, childNodeId: tofu.id, edgeType: EdgeType.HAS_OPTION, displayOrder: 2 },
      { parentNodeId: proteinGroup.id, childNodeId: beef.id, edgeType: EdgeType.HAS_OPTION, displayOrder: 3 },
      { parentNodeId: veggieGroup.id, childNodeId: broccoli.id, edgeType: EdgeType.HAS_OPTION, constraints: { min: 0, max: 5, required: false }, displayOrder: 1 },
      { parentNodeId: veggieGroup.id, childNodeId: edamame.id, edgeType: EdgeType.HAS_OPTION, displayOrder: 2 },
      { parentNodeId: veggieGroup.id, childNodeId: avocado.id, edgeType: EdgeType.HAS_OPTION, displayOrder: 3 },
      { parentNodeId: sauceGroup.id, childNodeId: teriyaki.id, edgeType: EdgeType.HAS_OPTION, constraints: { min: 1, max: 1, required: true }, displayOrder: 1 },
      { parentNodeId: sauceGroup.id, childNodeId: peanut.id, edgeType: EdgeType.HAS_OPTION, displayOrder: 2 },
    ],
  });

  console.log('✅ Created Build Your Own Bowl with DAG');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n✨ Seed completed successfully!');
  console.log('📊 Summary:');
  console.log('   - 2 Taxes');
  console.log('   - 7 Categories (hierarchical)');
  console.log('   - 16 Simple Customizations');
  console.log('   - 28 Menu Items:');
  console.log('     • 4 Appetizers');
  console.log('     • 5 Italian dishes');
  console.log('     • 5 Indian dishes');
  console.log('     • 4 Chinese dishes');
  console.log('     • 4 Desserts');
  console.log('     • 5 Beverages');
  console.log('     • 1 Build Your Own Bowl (DAG)');
  console.log('   - 17 DAG Nodes');
  console.log('   - 11 DAG Edges');
  console.log('\n🎉 Database is ready with realistic menu data!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });