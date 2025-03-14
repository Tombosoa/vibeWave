import { Dimensions, StyleSheet } from "react-native";

export const audioPlayerStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0A1F44" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", textAlign: "center" },
  artist: { fontSize: 18, color: "#87CEFA", textAlign: "center", marginBottom: 20, width: "100%" },
  playPause: { marginTop: 20 },
});

export const audioItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 60, 114, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#636e72',
  },
});

const { width } = Dimensions.get('window');

export const audioListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3c72",
    textAlign: "center",
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  listContent: {
    paddingBottom: 80, // Espace pour la barre de contrôle
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1e3c72",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  controlButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#2a5298",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const playerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A1F44",
  },
});

export const customScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  comingSoon: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 10,
    textAlign: "center",
  },
});


export const headerLeftStyles = StyleSheet.create({
  menuIcon: {
    marginLeft: 15,
  },
});