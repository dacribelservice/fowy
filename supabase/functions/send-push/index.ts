import { serve } from "http/server.ts";
import { createClient } from "supabase";
import admin from "firebase-admin";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, title, body, data } = await req.json();

    if (!user_id) throw new Error('user_id is required');

    // 1. Obtener el fcm_token del perfil del usuario
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('fcm_token')
      .eq('id', user_id)
      .single();

    if (profileError || !profile?.fcm_token) {
      throw new Error('FCM token not found for user');
    }

    // 2. Inicializar Firebase Admin si no está inicializado
    if (admin.apps.length === 0) {
      const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT') ?? '{}');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    // 3. Enviar la notificación
    const message = {
      notification: { title, body },
      data: data || {},
      token: profile.fcm_token,
    };

    const response = await admin.messaging().send(message);

    return new Response(JSON.stringify({ success: true, messageId: response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
