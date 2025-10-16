package ai.arboris.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;

// --- DIRETIVA DE IGNIÇÃO #1: IMPORTAR O PLUGIN ---
import io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initializes the Bridge and registers plugins
        registerPlugins(new ArrayList<Class<? extends com.getcapacitor.Plugin>>() {{
            // --- DIRETIVA DE IGNIÇÃO #2: REGISTAR O PLUGIN NO ARRANQUE ---
            add(FirebaseAuthenticationPlugin.class);
        }});
    }
}