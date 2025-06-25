// Cart JS
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Please log in to view your cart.");
        window.location.href = 'login.html'; 
    }
    currentUser = user;
}

async function fetchCartFromDB() {
    const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', currentUser.id); 

    if (error) {
        console.error("Error fetching cart:", error.message);
        return [];
    }
    return data;
}

function displayCart(cartItems) {
    const cartList = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total');
    cartList.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product_name} - $${item.price.toFixed(2)} x${item.quantity}`;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });

    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

async function addToCartDB(productId, productName, price, quantity = 1) {
    const { data: existingItems, error: fetchError } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('product_id', productId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Fetch error:", fetchError.message);
        return;
    }

    if (existingItems) {
        const { error: updateError } = await supabase
            .from('carts')
            .update({ quantity: existingItems.quantity + quantity })
            .eq('id', existingItems.id);

        if (updateError) console.error("Update error:", updateError.message);
    } else {
        const { error: insertError } = await supabase
            .from('carts')
            .insert([
                {
                    user_id: currentUser.id,
                    product_id: productId,
                    product_name: productName,
                    price: price,
                    quantity: quantity
                }
            ]);

        if (insertError) console.error("Insert error:", insertError.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkUser();
    const cartItems = await fetchCartFromDB();
    displayCart(cartItems);
});