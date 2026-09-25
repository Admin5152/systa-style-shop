import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { BracketLabel } from "@/components/ui/BracketLabel";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Loader2, Plus, Trash2, Image as ImageIcon, 
  Home, ShoppingCart, Users, Package, 
  Tag, Shield, Edit, Save, Folder
} from "lucide-react";

export default function Admin() {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  
  // Product Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Category Form State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "SHOP" || activeTab === "OVERVIEW" || activeTab === "CATEGORIES") {
        fetchProducts();
        fetchCategories();
      }
      if (activeTab === "ORDERS" || activeTab === "OVERVIEW") fetchOrders();
      if (activeTab === "CUSTOMERS" || activeTab === "USER ROLES") fetchCustomers();

      // Realtime listener for new orders
      const channel = supabase
        .channel('admin-orders-changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders' },
          (payload) => {
            toast.success("🔔 New order received!");
            if (activeTab === "ORDERS" || activeTab === "OVERVIEW") {
              fetchOrders();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin, activeTab]);

  const fetchProducts = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });
    if (!error) setProducts(data || []);
    setIsFetching(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });
    if (!error) setCategories(data || []);
  };

  const fetchOrders = async () => {
    setIsFetching(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setIsFetching(false);
  };

  const fetchCustomers = async () => {
    setIsFetching(true);
    const { data: profiles, error: pErr } = await supabase.from("profiles").select("*");
    const { data: roles, error: rErr } = await supabase.from("user_roles").select("*");
    
    if (!pErr && profiles) {
      const merged = profiles.map(p => ({
        ...p,
        role: roles?.find(r => r.user_id === p.id)?.role || 'user'
      }));
      setCustomers(merged);
    }
    setIsFetching(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("10");
    setCategoryId("");
    setImageFile(null);
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setTitle(product.title);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategoryId(product.category_id || "");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      toast.error("Title and price are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let updatedData: any = {
        title, slug, description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category_id: categoryId || null,
      };

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
        updatedData.images = [publicUrlData.publicUrl];
      }

      if (editingId) {
        const { error } = await supabase.from("products").update(updatedData).eq("id", editingId);
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(updatedData);
        if (error) throw error;
        toast.success("Product added!");
      }

      resetProductForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted");
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to delete product");
    }
  };

  const resetCategoryForm = () => {
    setEditingCatId(null);
    setCatName("");
    setCatDesc("");
  };

  const handleEditCategoryClick = (cat: any) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description || "");
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmittingCat(true);
    try {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const catData = { name: catName, slug, description: catDesc };

      if (editingCatId) {
        const { error } = await supabase.from("categories").update(catData).eq("id", editingCatId);
        if (error) throw error;
        toast.success("Category updated!");
      } else {
        const { error } = await supabase.from("categories").insert(catData);
        if (error) throw error;
        toast.success("Category created!");
      }
      
      resetCategoryForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Delete this category? Products in this category will become uncategorized.")) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from("user_roles").upsert({ user_id: userId, role: newRole }, { onConflict: "user_id, role" });
      if (error) throw error;
      toast.success("User role updated");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  if (isAdminLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!isAdmin) return <Navigate to="/auth" />;

  const navItems = [
    { name: "OVERVIEW", icon: Home },
    { name: "ORDERS", icon: ShoppingCart },
    { name: "CUSTOMERS", icon: Users },
    { name: "CATEGORIES", icon: Folder },
    { name: "SHOP", icon: Package },
    { name: "PROMOTIONS", icon: Tag },
    { name: "USER ROLES", icon: Shield },
  ];

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen pt-20 bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-black text-white shrink-0 md:min-h-[calc(100vh-5rem)] border-r border-border/20">
        <div className="p-6">
          <BracketLabel className="text-white/50 mb-8">ADMIN PANEL</BracketLabel>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-4 px-4 py-3 font-heading text-sm uppercase tracking-widest transition-colors duration-200 ${
                  activeTab === item.name ? "bg-white text-black font-black" : "text-white/70 hover:bg-white/10 hover:text-white font-bold"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="mb-10 border-b border-border pb-6">
          <h1 className="text-4xl font-heading font-black tracking-tighter uppercase">{activeTab}</h1>
        </div>

        {activeTab === "OVERVIEW" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-black text-white border border-black/10 shadow-sm">
              <h3 className="font-heading tracking-widest uppercase text-[10px] text-white/50 mb-2">Total Revenue</h3>
              <p className="font-mono text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-6 bg-white border border-black/10 shadow-sm">
              <h3 className="font-heading tracking-widest uppercase text-[10px] text-black/50 mb-2">Total Orders</h3>
              <p className="font-mono text-3xl font-bold">{totalOrders}</p>
            </div>
            <div className="p-6 bg-white border border-black/10 shadow-sm">
              <h3 className="font-heading tracking-widest uppercase text-[10px] text-black/50 mb-2">Pending Orders</h3>
              <p className="font-mono text-3xl font-bold">{pendingOrders}</p>
            </div>
          </div>
        )}

        {activeTab === "ORDERS" && (
          <div className="bg-white border border-black/10 shadow-sm">
            {isFetching ? <div className="p-12 text-center"><Loader2 className="animate-spin inline-block" /></div> : orders.length === 0 ? <p className="p-12 text-center font-mono">No orders found.</p> : (
              <div className="divide-y divide-black/10">
                {orders.map(order => (
                  <div key={order.id} className="p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-4 hover:bg-black/5 transition-colors">
                    <div>
                      <p className="font-heading font-bold uppercase mb-1">Order #{order.id.substring(0,8)}</p>
                      <p className="font-mono text-xs text-black/60">{order.full_name} | {order.email}</p>
                      <p className="font-mono text-xs text-black/60 mt-2">Address: {order.delivery_address}</p>
                      <p className="font-mono font-bold mt-2">${order.total_amount}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select 
                        value={order.status || 'pending'} 
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`font-mono text-xs uppercase p-2 border border-black/20 focus:ring-1 focus:ring-black outline-none font-bold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "CATEGORIES" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1 border border-border p-6 bg-white shadow-sm h-fit">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading font-bold text-lg uppercase tracking-tight">{editingCatId ? "Edit Category" : "Create Category"}</h2>
                {editingCatId && (
                  <Button variant="ghost" size="sm" onClick={resetCategoryForm} className="text-xs uppercase tracking-widest text-muted-foreground">Cancel</Button>
                )}
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-heading tracking-widest uppercase mb-2">Category Name</label>
                  <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Silk Buubus" required />
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-widest uppercase mb-2">Description</label>
                  <Textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="h-24" placeholder="Brief description..." />
                </div>
                <Button type="submit" className="w-full uppercase tracking-widest text-xs h-12 bg-black text-white hover:bg-black/80" disabled={isSubmittingCat}>
                  {isSubmittingCat ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : editingCatId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {editingCatId ? "Save Changes" : "Add Category"}
                </Button>
              </form>
            </div>
            <div className="xl:col-span-2 border border-border bg-white shadow-sm flex flex-col min-h-[500px]">
              <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground">Category List</h2>
                <span className="font-mono text-xs bg-black text-white px-2 py-1">{categories.length} Categories</span>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {categories.length === 0 ? (
                   <p className="p-12 text-center font-mono text-black/50">No categories created yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {categories.map(cat => (
                      <div key={cat.id} className="border border-black/10 p-4 flex justify-between items-center hover:border-black/30 transition-colors">
                        <div>
                          <h3 className="font-heading font-bold uppercase tracking-tight text-lg mb-1">{cat.name}</h3>
                          <p className="font-mono text-xs text-black/50">{cat.slug}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCategoryClick(cat)} className="text-blue-600 hover:bg-blue-50"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "SHOP" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1 border border-border p-6 bg-white shadow-sm h-fit">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading font-bold text-lg uppercase tracking-tight">{editingId ? "Edit Product" : "Add New Product"}</h2>
                {editingId && (
                  <Button variant="ghost" size="sm" onClick={resetProductForm} className="text-xs uppercase tracking-widest text-muted-foreground">Cancel</Button>
                )}
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div><label className="block text-[10px] font-heading tracking-widest uppercase mb-2">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
                
                <div>
                  <label className="block text-[10px] font-heading tracking-widest uppercase mb-2">Category</label>
                  <select 
                    value={categoryId} 
                    onChange={e => setCategoryId(e.target.value)}
                    className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono uppercase"
                  >
                    <option value="">No Category (Uncategorized)</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-[10px] font-heading tracking-widest uppercase mb-2">Price ($)</label><Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
                  <div><label className="block text-[10px] font-heading tracking-widest uppercase mb-2">Stock</label><Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required /></div>
                </div>
                <div><label className="block text-[10px] font-heading tracking-widest uppercase mb-2">Description</label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-24" /></div>
                <div><label className="block text-[10px] font-heading tracking-widest uppercase mb-2">{editingId ? "Replace Image (Optional)" : "Primary Image"}</label><Input type="file" accept="image/*" onChange={handleImageChange} /></div>
                <Button type="submit" className="w-full uppercase tracking-widest text-xs h-12 bg-black text-white hover:bg-black/80" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {editingId ? "Save Changes" : "Publish Product"}
                </Button>
              </form>
            </div>
            <div className="xl:col-span-2 border border-border bg-white shadow-sm flex flex-col min-h-[500px]">
              <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground">Active Catalog</h2>
                <span className="font-mono text-xs bg-black text-white px-2 py-1">{products.length} Items</span>
              </div>
              <div className="flex-1 overflow-auto">
                {isFetching ? <div className="p-12 text-center"><Loader2 className="animate-spin inline-block" /></div> : (
                  <div className="pb-8">
                    {categories.map(cat => {
                      const catProducts = products.filter(p => p.category_id === cat.id);
                      if (catProducts.length === 0) return null;
                      return (
                        <div key={cat.id} className="mb-6">
                          <h3 className="bg-black/5 px-4 py-2 font-heading font-bold text-xs uppercase tracking-widest border-y border-black/10">{cat.name}</h3>
                          {catProducts.map(product => (
                            <div key={product.id} className="p-4 flex items-center justify-between hover:bg-muted/10 border-b last:border-0 group">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-muted shrink-0 overflow-hidden">
                                  {product.images?.[0] ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" /> : <ImageIcon className="h-6 w-6 m-auto text-black/30" />}
                                </div>
                                <div>
                                  <h3 className="font-heading font-bold uppercase tracking-tight text-lg mb-1">{product.title}</h3>
                                  <div className="text-xs font-mono space-x-3 text-black/60">
                                    <span className="font-bold text-black">${product.price}</span>
                                    <span className="w-1 h-1 inline-block rounded-full bg-border" />
                                    <span>Stock: {product.stock}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)} className="text-blue-600 hover:bg-blue-50"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    
                    {/* Uncategorized Products */}
                    {(() => {
                      const uncategorized = products.filter(p => !p.category_id);
                      if (uncategorized.length === 0) return null;
                      return (
                        <div className="mb-6">
                          <h3 className="bg-red-50 text-red-800 px-4 py-2 font-heading font-bold text-xs uppercase tracking-widest border-y border-red-200">Uncategorized (Needs Category)</h3>
                          {uncategorized.map(product => (
                            <div key={product.id} className="p-4 flex items-center justify-between hover:bg-muted/10 border-b last:border-0 group bg-red-50/30">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-muted shrink-0 overflow-hidden">
                                  {product.images?.[0] ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" /> : <ImageIcon className="h-6 w-6 m-auto text-black/30" />}
                                </div>
                                <div>
                                  <h3 className="font-heading font-bold uppercase tracking-tight text-lg mb-1">{product.title}</h3>
                                  <div className="text-xs font-mono space-x-3 text-black/60">
                                    <span className="font-bold text-black">${product.price}</span>
                                    <span className="w-1 h-1 inline-block rounded-full bg-border" />
                                    <span>Stock: {product.stock}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)} className="text-blue-600 hover:bg-blue-50"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(activeTab === "CUSTOMERS" || activeTab === "USER ROLES") && (
          <div className="bg-white border border-black/10 shadow-sm">
             <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground">Registered Accounts</h2>
                <span className="font-mono text-xs bg-black text-white px-2 py-1">{customers.length} Users</span>
              </div>
            {isFetching ? <div className="p-12 text-center"><Loader2 className="animate-spin inline-block" /></div> : customers.length === 0 ? <p className="p-12 text-center font-mono">No customers found.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm">
                  <thead>
                    <tr className="border-b border-black/10 bg-black/5 text-[10px] font-heading tracking-widest uppercase text-black/60">
                      <th className="p-4">Customer ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email Contact</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {customers.map(customer => (
                      <tr key={customer.id} className="hover:bg-black/5 transition-colors">
                        <td className="p-4 text-xs">{customer.id.substring(0,8)}...</td>
                        <td className="p-4">{customer.first_name || 'N/A'} {customer.last_name || ''}</td>
                        <td className="p-4 text-xs text-black/50">Stored in Auth</td>
                        <td className="p-4">{customer.phone || 'N/A'}</td>
                        <td className="p-4">
                          <select 
                            value={customer.role} 
                            onChange={(e) => handleUpdateUserRole(customer.id, e.target.value)}
                            className="p-1 border border-black/20 text-xs font-bold outline-none uppercase"
                          >
                            <option value="user">USER</option>
                            <option value="admin">ADMIN</option>
                            <option value="super_admin">SUPER ADMIN</option>
                          </select>
                        </td>
                        <td className="p-4 text-black/60">{new Date(customer.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "PROMOTIONS" && (
           <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border bg-muted/10">
             <Tag className="h-12 w-12 text-black/20 mb-4" />
             <h2 className="font-heading text-xl uppercase tracking-widest text-muted-foreground mb-2">PROMOTIONS MODULE</h2>
             <p className="font-mono text-sm text-muted-foreground/70">Discount code management coming soon.</p>
           </div>
        )}
      </main>
    </div>
  );
}
