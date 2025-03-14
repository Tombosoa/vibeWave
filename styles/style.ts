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
    backgroundColor: "#f5f6fa",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    width: "100%",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1e3c72",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyMessage: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e3c72",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubMessage: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    maxWidth: width * 0.8,
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